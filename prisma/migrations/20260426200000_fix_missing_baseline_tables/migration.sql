-- ═══════════════════════════════════════════════════════════════════════════
-- REMEDIACIÓN DEL BASELINE
-- ═══════════════════════════════════════════════════════════════════════════
-- Cuando hicimos `migrate resolve --applied 20260426000000_init` (A3, switch a
-- migrate deploy) asumimos que la DB de prod coincidía con lo que la init
-- migration crearía. NO era el caso: la DB venía de db push de schemas más
-- antiguos, anteriores a Session (C2), Counter (C4) y RateLimitBucket (A1),
-- y esos modelos nunca llegaron a aplicarse al pasar a migrate deploy.
--
-- Resultado en prod: faltan 3 tablas. Login, rate-limit y orderNumber atómico
-- estaban rompiendo silenciosamente. Esta migración las crea de forma
-- idempotente (IF NOT EXISTS): en prod las añade; en una DB nueva creada
-- desde init, no hace nada.
-- ═══════════════════════════════════════════════════════════════════════════

-- Session
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Session_token_key" ON "Session"("token");
CREATE INDEX IF NOT EXISTS "Session_customerId_idx" ON "Session"("customerId");
CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session"("expiresAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'Session_customerId_fkey'
    ) THEN
        ALTER TABLE "Session"
        ADD CONSTRAINT "Session_customerId_fkey"
        FOREIGN KEY ("customerId") REFERENCES "Customer"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- RateLimitBucket
CREATE TABLE IF NOT EXISTS "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "RateLimitBucket_windowStart_idx" ON "RateLimitBucket"("windowStart");

-- Counter
CREATE TABLE IF NOT EXISTS "Counter" (
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("name")
);
