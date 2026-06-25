"use client"

import { useEffect } from "react"
import { trackEcommerceEvent } from "@/lib/ecommerce-events"

export default function NewsletterConfirmationEvent() {
  useEffect(() => {
    trackEcommerceEvent("newsletter_confirmed", {
      form_name: "double_opt_in",
    })
  }, [])

  return null
}
