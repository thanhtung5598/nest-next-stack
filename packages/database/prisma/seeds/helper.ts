import { PrismaClient } from '@prisma/client/extension';

export async function clearData(prisma: PrismaClient) {
  await prisma.$transaction([
    prisma.borrowRequest.deleteMany({}),
    prisma.userDevice.deleteMany({}),
    prisma.departmentDevice.deleteMany({}),
    prisma.device.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.category.deleteMany({}),
  ]);
}
