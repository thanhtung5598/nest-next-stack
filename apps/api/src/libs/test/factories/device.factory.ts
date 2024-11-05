import { prismaInstance } from '@repo/db';
import { DeviceStatus, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { clearPrismaModelData } from '../helper';

type CreateDeviceParams = Partial<Omit<Prisma.DeviceCreateArgs, 'data'>> & {
  data?: {
    status?: DeviceStatus;
    name?: string;
  };
};

const VAT_RATIO = 0.1;

export async function createDevice(params?: CreateDeviceParams) {
  const paramsData = params?.data || {};
  const category = await prismaInstance.category.findFirst();
  const price = faker.number.int({ max: 1000000 });

  const data: Prisma.DeviceCreateArgs['data'] = {
    name: faker.commerce.productName(),
    serialNumber: faker.string.sample(),
    status: DeviceStatus.in_stock,
    sku: faker.string.sample(),
    price: price,
    priceVat: price + price * VAT_RATIO,
    note: faker.lorem.sentence(),
    imageUrl: faker.image.urlLoremFlickr(),
    categoryId: category.id,
    buyAt: faker.date.anytime(),
    usedAt: faker.date.past(),
    expiredWarrantyAt: faker.date.past(),
    ...paramsData,
  };

  return await prismaInstance.device.create({
    ...(params || {}),
    data: data,
  });
}

export async function clearDevices() {
  await clearPrismaModelData(prismaInstance.userDevice);
  await clearPrismaModelData(prismaInstance.borrowRequest);
  return await clearPrismaModelData(prismaInstance.device);
}

export async function addDeviceForUser(deviceId: number, userId: string) {
  return prismaInstance.userDevice.create({
    data: {
      deviceId,
      userId,
    },
  });
}
