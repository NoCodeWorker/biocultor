import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, Leaf, CreditCard, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      {/* ──── Trust Badges Bar ──── */}
      <div className="w-full bg-cream-warm border-t border-border/60 py-10">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: 'Pago seguro', desc: 'Checkout protegido' },
            { icon: Truck, title: 'Envío Gratis >50€', desc: 'Península 24/48h laborables' },
            { icon: Leaf, title: 'Información de uso', desc: 'Formato y aplicación claros' },
            { icon: CreditCard, title: 'Múltiples Métodos', desc: 'Visa, Mastercard, Apple Pay' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-1 transition-all group-hover:bg-primary/18 group-hover:scale-105">
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="font-heading font-bold text-sm text-foreground tracking-tight">{title}</h4>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ──── Main Footer — brand-brown-dark bg ──── */}
      <div className="w-full bg-brand-brown-dark text-cream/85 pt-16 pb-8">
        <div className="w-[92%] lg:w-[80%] xl:w-[75%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Link href="/">
                <Image 
                  src="/Logo.svg" 
                  alt="Biocultor Logo" 
                  width={140} 
                  height={40} 
                  className="mb-6 brightness-[10] opacity-75 hover:opacity-100 transition-opacity" 
                />
              </Link>
              <p className="text-sm text-cream/55 leading-relaxed pr-4 mb-6">
                Biocultor presenta su producto desde formato, aplicación y contexto de uso,
                evitando promesas infladas y referencias regulatorias no verificadas en la propia web.
              </p>
              <div className="flex flex-col gap-3 text-sm text-cream/45">
                <a href="mailto:soporte@biocultor.com" className="flex items-center gap-2 hover:text-cream/80 transition-colors">
                  <Mail className="w-4 h-4" /> soporte@biocultor.com
                </a>
                <a href="tel:+34900123456" className="flex items-center gap-2 hover:text-cream/80 transition-colors">
                  <Phone className="w-4 h-4" /> +34 900 123 456
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Sevilla, Andalucía, España
                </span>
              </div>
            </div>

            {/* Explore */}
            <div className="lg:col-span-3">
              <h4 className="font-heading font-bold text-cream/90 mb-6 text-xs uppercase tracking-[0.15em]">Explorar</h4>
              <ul className="flex flex-col gap-3.5 text-sm">
                {[
                  { href: '/producto/te-humus-liquido-premium', label: 'La Gran Fórmula' },
                  { href: '/comprar-te-de-humus-de-lombriz', label: 'Comprar té de humus' },
                  { href: '/#formatos', label: 'Formatos y Precios' },
                  { href: '/te-de-humus-de-lombriz', label: 'Aplicaciones por cultivo' },
                  { href: '/aprende', label: 'Guías de Cultivo' },
                  { href: '/espana', label: 'Biocultor en España' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-cream/55 hover:text-cream/90 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="lg:col-span-2">
              <h4 className="font-heading font-bold text-cream/90 mb-6 text-xs uppercase tracking-[0.15em]">Soporte</h4>
              <ul className="flex flex-col gap-3.5 text-sm">
                {[
                  { href: '/contacto', label: 'Centro de Ayuda' },
                  { href: '/envios', label: 'Envíos y Entregas' },
                  { href: '/devoluciones', label: 'Cambios y Devoluciones' },
                  { href: '/contacto', label: 'Consultar ficha técnica' },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-cream/55 hover:text-cream/90 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="lg:col-span-3">
              <h4 className="font-heading font-bold text-cream/90 mb-6 text-xs uppercase tracking-[0.15em]">Legal</h4>
              <ul className="flex flex-col gap-3.5 text-sm">
                {[
                  { href: '/privacidad', label: 'Política de Privacidad' },
                  { href: '/terminos', label: 'Términos de Servicio' },
                  { href: '/cookies', label: 'Política de Cookies' },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-cream/55 hover:text-cream/90 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Certification Badge */}
              <div className="mt-8 p-4 border border-cream/10 rounded-2xl bg-cream/4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-cream/75">Compra informada</p>
                  <p className="text-[10px] text-cream/40 leading-snug mt-0.5">Sin sellos ni certificaciones no verificadas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cream/12 to-transparent mb-8" />

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-cream/35 gap-4">
            <p>© {new Date().getFullYear()} Biocultor®. Todos los derechos reservados.</p>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/50" />
              <span>Desarrollado en España con pasión por el campo.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
