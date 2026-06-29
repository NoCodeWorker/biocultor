"use client";

import dynamic from "next/dynamic";

const WhatsAppWidget = dynamic(
  () => import("./WhatsAppWidget").then((m) => m.WhatsAppWidget),
  { ssr: false }
);

export default function WhatsAppWidgetLazy() {
  return <WhatsAppWidget />;
}
