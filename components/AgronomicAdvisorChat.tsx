'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { X, Send, Leaf, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useUserProfileStore } from '@/store/userProfileStore';

// ─── Tipos de cross-sell ────────────────────────────────────────────────────
interface CrossSellVariant {
  id: string;
  sku: string;
  size: string;
  price: number;
  stock: number;
  product: { name: string; slug: string };
}
interface CrossSellData {
  ort5L: CrossSellVariant | null;
  bio5L: CrossSellVariant | null;
}

export default function AgronomicAdvisorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [crossSellData, setCrossSellData] = useState<CrossSellData | null>(null);

  // Carrito y perfil de usuario
  const cartItems = useCartStore((s) => s.items);
  const setProfile = useUserProfileStore((s) => s.setProfile);

  // Derivar si el carrito contiene Té de Humus o Purín de Ortiga
  const cartHasTe = cartItems.some((i) => i.sku?.startsWith('BIO-'));
  const cartHasOrtiga = cartItems.some((i) => i.sku?.startsWith('ORT-'));

  // Serializar carrito para el sistema prompt del backend
  const buildCartContext = useCallback(() => {
    if (cartItems.length === 0) return null;
    const lines = cartItems.map(
      (i) => `- ${i.name} (${i.size}, SKU: ${i.sku ?? 'N/A'}) × ${i.quantity} uds = ${(i.price * i.quantity).toFixed(2)}€`
    );
    return `El usuario tiene en el carrito:\n${lines.join('\n')}`;
  }, [cartItems]);

  // Cargar datos de stock al abrir el chat (solo una vez por sesión)
  useEffect(() => {
    if (!isOpen || crossSellData !== null) return;
    fetch('/api/cross-sell')
      .then((r) => r.json())
      .then((data) => setCrossSellData(data))
      .catch(() => setCrossSellData({ ort5L: null, bio5L: null }));
  }, [isOpen, crossSellData]);

  // Serializar contexto de stock para el backend
  const buildStockContext = useCallback(() => {
    if (!crossSellData) return null;
    const { ort5L, bio5L } = crossSellData;
    return [
      `Té de Humus 5L (BIO-5L): ${bio5L ? (bio5L.stock > 0 ? `En stock (${bio5L.stock} uds), precio ${bio5L.price}€` : 'SIN STOCK') : 'no disponible'}`,
      `Purín de Ortiga 5L (ORT-5L): ${ort5L ? (ort5L.stock > 0 ? `En stock (${ort5L.stock} uds), precio ${ort5L.price}€` : 'SIN STOCK — no recomendar para compra inmediata') : 'no disponible'}`,
    ].join('\n');
  }, [crossSellData]);

  // La SDK evalua `body` justo antes de enviar la petición al servidor.
  // Al usar una ref actualizada en cada render, el transport siempre
  // lee el contexto más reciente del carrito y el stock sin reinicializar el hook.
  const cartContextRef = useRef<string | null>(null);
  const stockContextRef = useRef<string | null>(null);

  // Actualizar las refs antes de cada render
  cartContextRef.current = buildCartContext();
  stockContextRef.current = buildStockContext();

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      // body es resuelto por la SDK en cada petición, permitiendo datos frescos
      body: {
        get cartContext() { return cartContextRef.current; },
        get stockContext() { return stockContextRef.current; },
      } as Record<string, unknown>,
    }),
  });
  const isLoading = status === 'submitted' || status === 'streaming';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extraer el último intent detectado y sincronizarlo con userProfileStore
  const lastIntent = messages
    .flatMap((m) => m.parts)
    .reverse()
    .find(
      (p) =>
        p.type === 'tool-updateUserIntent' &&
        (p as { state?: string }).state === 'output-available'
    ) as { output?: { intentScore?: number; crop?: string; problem?: string } } | undefined;

  const intentScore = Number(lastIntent?.output?.intentScore ?? 0);
  const isHot = intentScore > 70;

  // Sincronizar perfil detectado → userProfileStore (con persistencia en localStorage)
  useEffect(() => {
    if (!lastIntent?.output) return;
    const { crop, problem, intentScore: score } = lastIntent.output;
    if (crop || problem || score !== undefined) {
      setProfile({ crop, problem, intentScore: score });
    }
  }, [lastIntent, setProfile]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput('');
  };

  // ─── Lógica de cross-sell visual ─────────────────────────────────────────
  // Mostrar cross-sell de Purín si: usuario tiene Té en carrito + problema de plagas/hongos
  // O si el intent es alto y no tiene ningún producto de Biocultor aún
  const hasOrtPlagueProblem = lastIntent?.output?.problem
    ?.toLowerCase()
    .match(/plaga|hongo|oidio|mildiu|pulgón|araña|trips|botritis|patógen|enfermedad/);

  const ortigaInStock = (crossSellData?.ort5L?.stock ?? 0) > 0;
  const teInStock = (crossSellData?.bio5L?.stock ?? 0) > 0;

  // Cross-sell de Purín: usuario tiene Té y tiene problema de plagas y hay stock de Ortiga
  const showOrtigaCrossSell = isHot && cartHasTe && hasOrtPlagueProblem && ortigaInStock;

  // Cross-sell de Té: usuario tiene Purín y hay stock de Té
  const showTeCrossSell = isHot && cartHasOrtiga && !cartHasTe && teInStock;

  // Recomendación principal (sin carrito): sólo si hay stock
  const showMainReco = isHot && !cartHasTe && !cartHasOrtiga && teInStock;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-brown-dark/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-[4.5rem] md:bottom-6 right-5 flex items-center justify-center w-14 h-14 bg-brand-brown-dark rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:scale-105 border border-brand-green/20 transition-all duration-300 z-50 group ${
          isOpen ? 'opacity-0 pointer-events-none scale-90 translate-x-10' : 'opacity-100 scale-100 translate-x-0'
        }`}
        aria-label="Abrir asesor agronómico"
      >
        <div className="relative w-8 h-8">
          <Image src="/favicon.svg" alt="Asesor Biocultor" fill className="object-contain brightness-0 invert opacity-90" />
        </div>
        {/* Badge: indicador de carrito activo */}
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-green rounded-full flex items-center justify-center">
            <ShoppingCart className="w-2.5 h-2.5 text-white" />
          </span>
        )}
      </button>

      <div
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[420px] bg-white shadow-2xl z-[51] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] border-l border-brand-green/20 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-brand-brown-dark text-cream shrink-0 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
              <div className="relative w-7 h-7">
                <Image src="/favicon.svg" alt="Asesor" fill className="object-contain brightness-0 invert opacity-90" />
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg leading-tight">Inteligencia Agronómica</h3>
              <p className="text-xs text-cream/60 flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
                </span>
                En línea
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-cream/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors md:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Indicador contextual del carrito — visible solo si hay ítems */}
        {cartItems.length > 0 && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-brand-green/8 border-b border-brand-green/15 shrink-0">
            <ShoppingCart className="w-3.5 h-3.5 text-brand-green shrink-0" />
            <p className="text-[11px] text-brand-brown-dark/70 font-medium">
              El asesor conoce tu carrito y puede sugerirte combinaciones
            </p>
          </div>
        )}

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FAFAF9]">
          {messages.length === 0 && (
            <div className="text-center mt-12 space-y-5">
              <div className="w-24 h-24 mx-auto rounded-full bg-brand-green/10 flex items-center justify-center p-5 border border-brand-green/20">
                <div className="relative w-full h-full">
                  <Image src="/favicon.svg" alt="Biocultor" fill className="object-contain opacity-60" />
                </div>
              </div>
              <div className="max-w-[280px] mx-auto">
                <p className="text-base font-heading font-bold text-brand-brown-dark">
                  Asesoría Técnica de Suelos
                </p>
                <p className="text-sm text-brand-brown/60 mt-2 leading-relaxed">
                  Cuéntame qué cultivas y si estás notando algún problema en el vigor de la planta o en la retención de agua.
                </p>
              </div>
            </div>
          )}

          {messages
            .filter((m) => m.role !== 'system')
            .map((m) => {
              const text = m.parts
                .filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
                .map((p) => p.text)
                .join('');
              if (!text) return null;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] px-5 py-3.5 text-[14px] leading-relaxed shadow-sm ${
                      m.role === 'user'
                        ? 'bg-brand-brown-dark text-cream rounded-2xl rounded-tr-sm'
                        : 'bg-white border border-brand-brown/10 text-brand-brown-dark rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    {text}
                  </div>
                </div>
              );
            })}

          {isLoading && (
            <div className="flex items-start">
              <div className="px-5 py-4 bg-white border border-brand-brown/10 shadow-sm rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-brand-brown/30 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-brand-brown/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-brand-brown/30 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ─── Tarjeta de Cross-Sell: Purín de Ortiga ─────────────────────── */}
        {showOrtigaCrossSell && crossSellData?.ort5L && (
          <div className="px-5 py-4 bg-amber-50 border-t border-amber-200/60 flex flex-col gap-3 shrink-0 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700/80 mb-1">
                  Complemento Detectado
                </span>
                <span className="text-base font-heading font-extrabold text-brand-brown-dark leading-tight">
                  Purín de Ortiga 5L
                </span>
                <p className="text-[13px] text-brand-brown-dark/70 mt-1.5 leading-snug">
                  Refuerza las defensas frente a plagas. Combinado con el Té de Humus actúa como escudo biológico.
                </p>
                <span className="text-xs font-bold text-amber-700 mt-1">
                  {crossSellData.ort5L.price.toFixed(2)}€ · En stock
                </span>
              </div>
              <div className="w-16 h-16 relative shrink-0 bg-white rounded-xl border border-amber-200/60 overflow-hidden shadow-sm">
                <Image src="/purin-ortiga-5l.jpg" alt="Purín de Ortiga 5L" fill className="object-cover" />
              </div>
            </div>
            <Link
              href={`/producto/${crossSellData.ort5L.product.slug}`}
              className="flex items-center justify-center gap-2 w-full text-sm font-bold bg-amber-600 text-white px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors shadow-md"
            >
              Ver Purín de Ortiga
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ─── Tarjeta de Cross-Sell: Té de Humus ────────────────────────── */}
        {showTeCrossSell && crossSellData?.bio5L && (
          <div className="px-5 py-4 bg-brand-green-light border-t border-brand-green/20 flex flex-col gap-3 shrink-0 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green-dark/80 mb-1">
                  Base Biológica Recomendada
                </span>
                <span className="text-base font-heading font-extrabold text-brand-brown-dark leading-tight">
                  Té de Humus 5L
                </span>
                <p className="text-[13px] text-brand-brown-dark/70 mt-1.5 leading-snug">
                  Activa la biología del suelo. La base que hace más efectivo tu Purín de Ortiga.
                </p>
                <span className="text-xs font-bold text-brand-green-dark mt-1">
                  {crossSellData.bio5L.price.toFixed(2)}€ · En stock
                </span>
              </div>
              <div className="w-16 h-16 relative shrink-0 bg-white rounded-xl border border-brand-green/30 overflow-hidden shadow-sm">
                <Image src="/5 litros.jpg" alt="Té de Humus 5L" fill className="object-cover" />
              </div>
            </div>
            <Link
              href={`/producto/${crossSellData.bio5L.product.slug}`}
              className="flex items-center justify-center gap-2 w-full text-sm font-bold bg-brand-green text-white px-4 py-3 rounded-xl hover:bg-brand-green-dark transition-colors shadow-md"
            >
              Ver Té de Humus
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ─── Tarjeta de Recomendación Principal (sin carrito) ───────────── */}
        {showMainReco && crossSellData?.bio5L && (
          <div className="px-5 py-4 bg-brand-green-light border-t border-brand-green/20 flex flex-col gap-3 shrink-0 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-green-dark/80 mb-1">
                  Recomendación Agronómica
                </span>
                <span className="text-base font-heading font-extrabold text-brand-brown-dark leading-tight">
                  Formato Profesional 5L
                </span>
                <p className="text-[13px] text-brand-brown-dark/70 mt-1.5 leading-snug">
                  Volumen ideal para restituir la biología de tu suelo en todo el ciclo del cultivo.
                </p>
              </div>
              <div className="w-16 h-16 relative shrink-0 bg-white rounded-xl border border-brand-green/30 overflow-hidden shadow-sm">
                <Image src="/10 litros.jpg" alt="Té de humus 5L" fill className="object-cover" />
              </div>
            </div>
            <Link
              href="/producto/te-humus-liquido-premium"
              className="flex items-center justify-center gap-2 w-full text-sm font-bold bg-brand-green text-white px-4 py-3 rounded-xl hover:bg-brand-green-dark transition-colors shadow-md"
            >
              Ver formato recomendado
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-brand-brown/10 shrink-0 pb-6 sm:pb-4">
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Explica tu caso al asesor..."
              className="w-full pl-5 pr-14 py-4 bg-[#FAFAF9] border border-brand-brown/15 rounded-xl text-[14px] focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-brand-brown-dark placeholder:text-brand-brown/40"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2.5 bg-brand-brown-dark text-cream rounded-lg hover:bg-primary transition-colors disabled:opacity-50 disabled:hover:bg-brand-brown-dark"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-3 opacity-60">
            <Leaf className="w-3 h-3 text-brand-brown" />
            <span className="text-[10px] text-brand-brown font-bold tracking-widest uppercase">
              Asesoría basada en evidencia científica
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
