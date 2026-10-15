CREATE TYPE "FeaturedBannerTarget" AS ENUM ('PARTNER', 'PRODUCT', 'SERVICE');

CREATE TABLE "FeaturedBanner" (
    "id" TEXT NOT NULL,
    "targetType" "FeaturedBannerTarget" NOT NULL,
    "targetId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedBanner_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FeaturedBanner_active_startsAt_endsAt_idx" ON "FeaturedBanner"("active", "startsAt", "endsAt");
CREATE INDEX "FeaturedBanner_targetType_targetId_idx" ON "FeaturedBanner"("targetType", "targetId");
