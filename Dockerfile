# syntax=docker/dockerfile:1.7
# Multi-stage build para Next.js 16 con output standalone + Prisma (PostgreSQL)

# ─── 1. Dependencias ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --include=dev

# ─── 2. Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1

# DATABASE_URL disponible en build-time para que Next pueda pre-renderizar
# páginas que consultan Prisma (p.ej. la home vía ISR). Requiere que el
# servicio `db` esté arriba antes del build y que el build se adjunte a
# la red interna del compose (ver docker-compose.yml → build.network).
# El ARG vive solo en esta stage; no se copia al runner, así no se filtra
# al runtime final.
ARG DATABASE_URL
RUN test -n "$DATABASE_URL" || (echo "ERROR: DATABASE_URL requerido en build-time. Revisa docker-compose.yml → build.args y que la DB esté arriba." && exit 1)
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build

# ─── 3. Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Artefacto standalone (contiene server.js + node_modules minimizados)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma (schema + binarios + cliente generado) para poder ejecutar migrate deploy
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
