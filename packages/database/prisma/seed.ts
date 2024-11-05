import { PrismaClient } from '@prisma/client';
import { createDepartments } from './seeds/department';
import { createTestUser, createUsers } from './seeds/user';
import { createCategories } from './seeds/category';
import { createDummyDevices } from './seeds/dummyDevice';
import { createBrands } from './seeds/brand';
import { createDummyBorrows } from './seeds/dummyBorrow';

const prisma = new PrismaClient({
  // turn on debug mode
  log: [
    {
      emit: 'stdout',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
});

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

async function main() {
  await createCategories(prisma);
  await createBrands(prisma);
  await createDepartments(prisma);
  await createUsers(prisma);
  if (isTest) {
    await createTestUser(prisma);
  }
  if (isDevelopment) {
    await createDummyDevices(prisma);
    try {
      const borrowRequestsCount = await prisma.borrowRequest.count({});
      if (borrowRequestsCount === 0) {
        await createDummyBorrows(prisma);
      }
    } catch (err) {
      console.log('Seed borrow request failed', err);
    }
  }
}

main()
  .then(() => {
    console.info('Seeding complete!');
  })
  .catch((err) => {
    console.error('Seeding failed!', err);
  })
  .finally(() => prisma.$disconnect());
