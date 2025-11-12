import { PrismaClient } from "@prisma/client";

type GlobalWithPrisma = typeof globalThis & { prisma?: PrismaClient };

const globalForPrisma = globalThis as GlobalWithPrisma;

const isNextBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
const isVercelBuildStep =
  process.env.VERCEL === "1" && process.env.NEXT_RUNTIME === undefined;

const shouldSkipInit =
  process.env.SKIP_PRISMA_INIT === "true" &&
  (isNextBuildPhase || isVercelBuildStep);

const client =
  globalForPrisma.prisma ??
  (shouldSkipInit
    ? ({} as PrismaClient)
    : new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["error", "warn"]
            : ["error"],
      }));

if (!shouldSkipInit && process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client;
}

export const prisma = client;
