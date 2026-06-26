"use client"

import Link from "next/link"
import { type ReactNode } from "react"
import { trackEcommerceEvent } from "@/lib/ecommerce-events"

type TrackedContactLinkProps = {
  href: string
  channel: "phone" | "whatsapp" | "contact_page" | "service_cta"
  className?: string
  target?: string
  rel?: string
  children: ReactNode
}

export default function TrackedContactLink({
  href,
  channel,
  className,
  target,
  rel,
  children,
}: TrackedContactLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() => {
        trackEcommerceEvent("contact_click", {
          interaction_source: channel,
          item_list_name: "contact_options",
        })
      }}
    >
      {children}
    </Link>
  )
}
