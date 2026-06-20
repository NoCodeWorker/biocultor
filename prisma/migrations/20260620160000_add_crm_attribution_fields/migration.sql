ALTER TABLE "CrmContact" ADD COLUMN "sourcePath" TEXT;
ALTER TABLE "CrmContact" ADD COLUMN "sourceQuery" TEXT;
ALTER TABLE "CrmContact" ADD COLUMN "sourceReferrer" TEXT;
ALTER TABLE "CrmContact" ADD COLUMN "serviceSlug" TEXT;
ALTER TABLE "CrmContact" ADD COLUMN "leadIntent" TEXT;
ALTER TABLE "CrmContact" ADD COLUMN "estimatedM2" TEXT;
ALTER TABLE "CrmContact" ADD COLUMN "estimatedPrice" TEXT;

CREATE INDEX "CrmContact_sourcePath_idx" ON "CrmContact"("sourcePath");
CREATE INDEX "CrmContact_leadIntent_idx" ON "CrmContact"("leadIntent");
