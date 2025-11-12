-- AlterTable
ALTER TABLE "PartnerProduct"
ADD COLUMN "imageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "PartnerProduct"
SET "imageUrls" = ARRAY["imageUrl"]
WHERE "imageUrl" IS NOT NULL;

ALTER TABLE "PartnerProduct"
DROP COLUMN "imageUrl";
