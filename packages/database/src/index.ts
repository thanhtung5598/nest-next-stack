import { PrismaClient } from '@prisma/client';

export const prismaInstance = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
