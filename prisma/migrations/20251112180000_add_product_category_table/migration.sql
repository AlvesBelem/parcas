-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");
CREATE UNIQUE INDEX "ProductCategory_slug_key" ON "ProductCategory"("slug");

-- AlterTable
ALTER TABLE "PartnerProduct" ADD COLUMN "categoryId" TEXT;

-- Populate categories based on existing data
WITH existing_categories AS (
    SELECT DISTINCT COALESCE(NULLIF(TRIM("category"), ''), 'Sem categoria') AS category
    FROM "PartnerProduct"
    WHERE "category" IS NOT NULL
)
INSERT INTO "ProductCategory" ("id", "name", "slug", "createdAt", "updatedAt")
SELECT
    (md5(random()::text || clock_timestamp()::text))::uuid,
    category,
    CASE
        WHEN regexp_replace(lower(category), '[^a-z0-9]+', '-', 'g') = ''
            THEN 'categoria-' || substr(md5(random()::text), 1, 8)
        ELSE regexp_replace(lower(category), '[^a-z0-9]+', '-', 'g')
    END,
    NOW(),
    NOW()
FROM existing_categories
ON CONFLICT ("name") DO NOTHING;

UPDATE "PartnerProduct" AS pp
SET "categoryId" = pc.id
FROM "ProductCategory" AS pc
WHERE lower(COALESCE(NULLIF(TRIM(pp."category"), ''), 'Sem categoria')) = lower(pc."name");

ALTER TABLE "PartnerProduct" DROP COLUMN "category";

-- AddForeignKey
ALTER TABLE "PartnerProduct" ADD CONSTRAINT "PartnerProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
