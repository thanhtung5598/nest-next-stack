import { Device, DeviceStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

function generateBuyAt(): Date {
  const years = faker.number.int({ min: 1, max: 10 });
  return faker.date.past({ years });
}

export function createDeviceStub(): Device {
  return {
    id: faker.number.int(),
    name: faker.commerce.productName(),
    categoryId: faker.number.int(),
    brandId: faker.number.int(),
    model: faker.string.sample(),
    serialNumber: faker.string.sample(),
    status: faker.helpers.enumValue(DeviceStatus),
    sku: faker.string.sample(),
    buyAt: generateBuyAt(),
    usedAt: null,
    expiredWarrantyAt: null,
    price: null,
    priceVat: null,
    note: faker.lorem.sentence(),
    createdAt: new Date(),
    updatedAt: new Date(),
    imageUrl: faker.image.urlLoremFlickr(),
  };
}

export function createDeviceStubs(length?: number): Device[] {
  const stubLength: number = length || 1;
  return Array.from({ length: stubLength }).map(() => createDeviceStub());
}
