import { PrismaClient, Brand } from '@prisma/client';

const data = [
  { name: 'Apple', code: 'apple' },
  { name: 'Belkin', code: 'belkin' },
  { name: 'Baseus', code: 'baseus' },
  { name: 'Ugreen', code: 'ugreen' },
  { name: 'Amazon', code: 'amazon' },
  { name: 'Elecom', code: 'elecom' },
  { name: 'Senko', code: 'senko' },
  { name: 'DELL', code: 'dell' },
  { name: 'Logitech', code: 'logitech' },
  { name: 'HP', code: 'hp' },
  { name: 'BeeCube', code: 'beecube' },
  { name: 'Sharp', code: 'sharp' },
  { name: 'Xiaomi', code: 'xiaomi' },
  { name: 'Samsung', code: 'samsung' },
  { name: 'JABRA', code: 'jabra' },
  { name: 'Mobell', code: 'mobell' },
];

export async function createBrands(prisma: PrismaClient): Promise<Brand[]> {
  return Promise.all(
    data.map(async (brand) => {
      return await prisma.brand.upsert({
        where: {
          code: brand.code,
        },
        create: {
          name: brand.name,
          code: brand.code,
        },
        update: {},
      });
    }),
  );
}
