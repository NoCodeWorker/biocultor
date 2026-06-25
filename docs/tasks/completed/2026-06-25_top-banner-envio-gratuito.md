# Top banner de envío gratuito

## Objective

Hacer visible el envío gratuito en todos los formatos desde el primer viewport y dirigir tráfico cualificado hacia la ficha canónica de producto.

## Context

La política comercial ya aplica envío gratuito a todos los formatos. Faltaba comunicarla de forma persistente, coherente con la identidad visual y medible como palanca CRO.

## Affected systems

- `components/ShippingAnnouncement.tsx`
- `components/Navbar.tsx`
- `components/ProductFunnel.tsx`
- `app/(shop)/cuenta/page.tsx`
- `app/(shop)/servicios/[slug]/page.tsx`
- `app/globals.css`
- `lib/ecommerce-events.ts`

## Implementation

- Banner superior enlazado a la ficha canónica de té de humus.
- Copy y jerarquía adaptados a móvil, portátil y sobremesa.
- Tratamiento visual basado en los tokens forestales y crema existentes.
- Animación ambiental CSS con soporte para `prefers-reduced-motion`.
- Evento GA4 `select_promotion` con slot `top_banner`.
- Ajuste de offsets sticky afectados por la nueva altura del header.

## Decisions

- El banner no es descartable porque comunica una condición comercial estable.
- No se añadieron dependencias ni parámetros UTM internos.
- El seguimiento es fail-open y reutiliza la capa de eventos existente.

## Risks

- El incremento de conversión debe validarse con datos de clic, add-to-cart y compra.
- El entorno local sin base Docker usa los fallbacks existentes para renderizar la home.

## Validation checklist

- ESLint específico sin errores.
- TypeScript sin errores.
- Build de producción completado.
- Inspección visual en 390x844, 1366x768 y 1920x1080.
- Header sticky y contenido sin cortes en los tres viewports.
- Contraste, foco y movimiento reducido verificados.

## Rollback considerations

Revertir el componente, su integración en `Navbar`, los estilos asociados, el evento `select_promotion` y los offsets sticky. No existe migración de datos.
