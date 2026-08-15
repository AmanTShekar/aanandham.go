import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

export const isPrismaConfigured = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0);

export const prisma =
    globalForPrisma.prisma ||
    (isPrismaConfigured
        ? new PrismaClient({
              log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
          })
        : null);

if (process.env.NODE_ENV !== 'production' && prisma) {
    globalForPrisma.prisma = prisma;
}

export default prisma;
