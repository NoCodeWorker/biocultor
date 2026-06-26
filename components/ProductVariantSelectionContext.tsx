"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type SelectableVariant = {
  id: string
  popular?: boolean | null
}

type ProductVariantSelectionContextValue = {
  selectedVariantId: string
  selectVariant: (variantId: string) => void
}

const ProductVariantSelectionContext =
  createContext<ProductVariantSelectionContextValue | null>(null)

export function ProductVariantSelectionProvider({
  variants,
  children,
}: {
  variants: SelectableVariant[]
  children: ReactNode
}) {
  const defaultVariant = useMemo(
    () => variants.find((variant) => variant.popular) ?? variants[0],
    [variants]
  )
  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultVariant?.id ?? ""
  )
  const effectiveSelectedVariantId = variants.some(
    (variant) => variant.id === selectedVariantId
  )
    ? selectedVariantId
    : (defaultVariant?.id ?? "")

  return (
    <ProductVariantSelectionContext.Provider
      value={{
        selectedVariantId: effectiveSelectedVariantId,
        selectVariant: setSelectedVariantId,
      }}
    >
      {children}
    </ProductVariantSelectionContext.Provider>
  )
}

export function useProductVariantSelection() {
  const context = useContext(ProductVariantSelectionContext)

  if (!context) {
    throw new Error(
      "useProductVariantSelection must be used inside ProductVariantSelectionProvider"
    )
  }

  return context
}
