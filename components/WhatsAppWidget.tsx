"use client";

import React, { useState, useEffect } from "react";
import { trackEcommerceEvent } from "@/lib/ecommerce-events";

export const WhatsAppWidget: React.FC = () => {
  const [showWidget, setShowWidget] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Show button after 3 seconds of page load
    const timer = setTimeout(() => {
      setShowWidget(true);
    }, 3000);

    // Show card slightly after the button
    const cardTimer = setTimeout(() => {
      setShowCard(true);
    }, 4200);

    return () => {
      clearTimeout(timer);
      clearTimeout(cardTimer);
    };
  }, []);

  const handleClick = () => {
    trackEcommerceEvent("contact_click", {
      interaction_source: "whatsapp_widget",
      source_path:
        typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    // Standard WhatsApp link with prefilled Biocultor message
    const phoneNumber = "34601144399";
    const message = encodeURIComponent(
      "Hola, acabo de estar en la web de Biocultor y me gustaría obtener información sobre el té de humus de lombriz."
    );
    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (!showWidget) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2"
      style={{
        animation: "whatsapp-widget-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {/* Brand message card — hidden on mobile */}
      <div
        className="hidden sm:block bg-white border border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-2xl px-4 py-3 text-left max-w-[260px]"
        style={{
          opacity: showCard ? 1 : 0,
          transform: showCard ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div className="flex gap-2 items-center">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
          </span>
          <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">
            ATENCIÓN DIRECTA
          </span>
        </div>
        <p className="text-[11px] font-bold text-zinc-950 mt-1 leading-normal">
          ¿Dudas sobre nuestro té de humus? Te respondemos al instante.
        </p>
      </div>

      {/* WhatsApp Floating Button */}
      <button
        id="whatsapp-widget-btn"
        onClick={handleClick}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#128C7E] transition-all duration-300 active:scale-95 shadow-[0_10px_25px_rgba(37,211,102,0.3)] focus:outline-none"
        aria-label="Contactar por WhatsApp"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none -z-10 opacity-75" />

        {/* WhatsApp SVG icon */}
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 fill-current group-hover:scale-105 transition-transform duration-300"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </button>

      <style>{`
        @keyframes whatsapp-widget-in {
          from { opacity: 0; transform: scale(0.8) translateY(50px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default WhatsAppWidget;
