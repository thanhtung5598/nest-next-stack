import { PrismaClient, Category } from '@prisma/client';

const data = [
  {
    name: 'Adapter',
    code: 'adapter',
  },
  {
    name: 'Amazon Echo',
    code: 'amazon_echo',
  },
  {
    name: 'Cable',
    code: 'cable',
  },
  {
    name: 'Fan',
    code: 'fan',
  },
  {
    name: 'Monitor',
    code: 'monitor',
  },
  {
    name: 'Mouse',
    code: 'mouse',
  },
  {
    name: 'Macbook',
    code: 'macbook',
  },
  {
    name: 'Window',
    code: 'window',
  },
  {
    name: 'Projector',
    code: 'projector',
  },
  {
    name: 'Smartphone',
    code: 'smartphone',
  },
  {
    name: 'Speaker',
    code: 'speaker',
  },
  {
    name: 'Phone',
    code: 'phone',
  },
  {
    name: 'Others',
    code: 'others',
  },
];

export async function createCategories(prisma: PrismaClient): Promise<Category[]> {
  return Promise.all(
    data.map(async (category) => {
      return await prisma.category.upsert({
        where: {
          code: category.code,
        },
        create: {
          name: category.name,
          code: category.code,
        },
        update: {},
      });
    }),
  );
}
