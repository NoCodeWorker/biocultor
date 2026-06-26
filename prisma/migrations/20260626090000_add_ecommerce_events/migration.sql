CREATE TABLE "EcommerceEvent" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "productSlug" TEXT,
    "variantSku" TEXT,
    "variantSize" TEXT,
    "itemName" TEXT,
    "quantity" INTEGER,
    "value" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "device" TEXT,
    "sourcePath" TEXT,
    "referrer" TEXT,
    "interactionSource" TEXT,
    "itemListName" TEXT,
    "promotionName" TEXT,
    "creativeSlot" TEXT,
    "formName" TEXT,
    "errorMessage" TEXT,
    "orderNumber" TEXT,
    "stripeSession" TEXT,
    "dedupeKey" TEXT,
    "metadataJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EcommerceEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EcommerceEvent_dedupeKey_key" ON "EcommerceEvent"("dedupeKey");
CREATE INDEX "EcommerceEvent_eventName_createdAt_idx" ON "EcommerceEvent"("eventName", "createdAt");
CREATE INDEX "EcommerceEvent_sessionId_createdAt_idx" ON "EcommerceEvent"("sessionId", "createdAt");
CREATE INDEX "EcommerceEvent_productSlug_createdAt_idx" ON "EcommerceEvent"("productSlug", "createdAt");
CREATE INDEX "EcommerceEvent_variantSku_createdAt_idx" ON "EcommerceEvent"("variantSku", "createdAt");
CREATE INDEX "EcommerceEvent_createdAt_idx" ON "EcommerceEvent"("createdAt");
