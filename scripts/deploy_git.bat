@echo off
cd /d "d:\BIOCULTOR\BIOCULTOR SHOP\biocultor"
git add "app/(shop)/solucion-humus/[slug]/page.tsx"
git add "app/api/cross-sell/route.ts"
git add "components/Cart.tsx"
git commit -m "feat: Rendimiento e Incremento de AOV (ISR solucion-humus, barra de progreso con milestones y quick-add de 1L para envio gratis)"
git push origin main
