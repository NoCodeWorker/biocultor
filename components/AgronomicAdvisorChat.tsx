'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { X, Send, Leaf } from 'lucide-react';
import Image from 'next/image';

export default function AgronomicAdvisorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract intent data from the latest tool invocation (if any)
  const lastToolCall = messages
    .flatMap((m) => m.toolInvocations || [])
    .reverse()
    .find((t) => t.toolName === 'updateUserIntent');

  const intentScore = lastToolCall && 'result' in lastToolCall ? lastToolCall.result.intentScore : 0;
  const isHot = intentScore > 70;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-brand-brown-dark/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Chat */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] border-l border-brand-green/20 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* FAB attached to the Sidebar (moves dynamically with the sidebar) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute bottom-6 -left-[76px] flex items-center justify-center w-14 h-14 bg-brand-brown-dark rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:scale-105 border border-brand-green/20 transition-all z-50 group"
          aria-label="Abrir asesor"
        >
          {isOpen ? (
            <div className="relative flex items-center justify-center w-full h-full">
              <X className="w-6 h-6 text-cream absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="relative w-7 h-7 group-hover:opacity-0 transition-opacity duration-200">
                <Image src="/Favicon.svg" alt="Cerrar" fill className="object-contain brightness-0 invert opacity-90" />
              </div>
            </div>
          ) : (
            <div className="relative w-8 h-8">
              <Image src="/Favicon.svg" alt="Asesor Biocultor" fill className="object-contain brightness-0 invert opacity-90" />
            </div>
          )}
        </button>

        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-brand-brown-dark text-cream shrink-0 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
              <div className="relative w-7 h-7">
                <Image src="/Favicon.svg" alt="Asesor" fill className="object-contain brightness-0 invert opacity-90" />
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

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FAFAF9]">
          {messages.length === 0 && (
            <div className="text-center mt-12 space-y-5">
              <div className="w-24 h-24 mx-auto rounded-full bg-brand-green/10 flex items-center justify-center p-5 border border-brand-green/20">
                <div className="relative w-full h-full">
                  <Image src="/Favicon.svg" alt="Biocultor" fill className="object-contain opacity-60" />
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
          
          {messages.filter(m => m.role !== 'system' && !m.toolInvocations).map((m) => (
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
                {m.content}
              </div>
            </div>
          ))}
          
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

        {/* Hot Intent Offer Injection */}
        {isHot && (
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
            <a 
              href="/producto/te-de-humus-de-lombriz-liquido" 
              className="flex items-center justify-center w-full text-sm font-bold bg-brand-green text-white px-4 py-3 rounded-xl hover:bg-brand-green-dark transition-colors shadow-md mt-1"
            >
              Ver formato recomendado
            </a>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-brand-brown/10 shrink-0 pb-6 sm:pb-4">
          <div className="relative flex items-center">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Explica tu caso al asesor..."
              className="w-full pl-5 pr-14 py-4 bg-[#FAFAF9] border border-brand-brown/15 rounded-xl text-[14px] focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all text-brand-brown-dark placeholder:text-brand-brown/40"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input?.trim() || isLoading}
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
