/*
  Warnings:

  - You are about to drop the column `price` on the `PartnerProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PartnerProduct" DROP COLUMN "price",
ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PartnerClickStat" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerClickStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductClickStat" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductClickStat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerClickStat_partnerId_date_key" ON "PartnerClickStat"("partnerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ProductClickStat_productId_date_key" ON "ProductClickStat"("productId", "date");

-- AddForeignKey
ALTER TABLE "PartnerClickStat" ADD CONSTRAINT "PartnerClickStat_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductClickStat" ADD CONSTRAINT "ProductClickStat_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PartnerProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
