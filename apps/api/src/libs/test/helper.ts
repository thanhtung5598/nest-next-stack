import { PrismaClient } from '@prisma/client';

export async function clearPrismaModelData(model: any): Promise<void> {
  if (!process.env.DATABASE_URL.includes('test')) {
    throw new Error(
      'Not in test environment, make sure you are using test database for this action',
    );
  }
  return model.deleteMany({});
}
