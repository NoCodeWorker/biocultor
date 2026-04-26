-- ── M7: separar OTPs de Customer ─────────────────────────────────────────────
-- Migración destructiva en Customer: estas dos columnas eran throwaway
-- (se nullean al verificar o expirar). OTPs activos en el momento del deploy
-- se invalidan; el cliente afectado tendrá que pedir uno nuevo.

-- DropColumn
ALTER TABLE "Customer" DROP COLUMN IF EXISTS "loginCode";
ALTER TABLE "Customer" DROP COLUMN IF EXISTS "loginCodeExpiresAt";

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoginAttempt_email_key" ON "LoginAttempt"("email");

-- CreateIndex
CREATE INDEX "LoginAttempt_expiresAt_idx" ON "LoginAttempt"("expiresAt");

-- ── M8: audit log admin ─────────────────────────────────────────────────────

-- CreateTable
CREATE TABLE "AdminAction" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "payload" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAction_createdAt_idx" ON "AdminAction"("createdAt");

-- CreateIndex
CREATE INDEX "AdminAction_action_createdAt_idx" ON "AdminAction"("action", "createdAt");

-- ── M3: índices en Order para acelerar el panel admin ──────────────────────

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
