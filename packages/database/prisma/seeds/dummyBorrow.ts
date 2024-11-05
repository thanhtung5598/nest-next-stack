import { BorrowRequest, DeviceStatus, UserDevice, UserRole, UsingStatus } from '@prisma/client';
import { PrismaClient } from '@prisma/client/extension';
import { faker } from '@faker-js/faker';

export class BorrowFactory {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  private async getOwnerDeviceIds({
    exceptedUserId,
  }: {
    exceptedUserId?: string;
  }): Promise<number[]> {
    const userDevices = await this.prisma.userDevice.findMany({
      where: exceptedUserId
        ? {
            NOT: {
              userId: exceptedUserId,
            },
          }
        : {},
      select: {
        deviceId: true,
        userId: true,
      },
    });

    return userDevices.map((u: UserDevice) => u.deviceId);
  }

  async getUsedDeviceIds({ exceptedUserId }: { exceptedUserId?: string }): Promise<number[]> {
    const ownerDeviceIds = await this.getOwnerDeviceIds({ exceptedUserId });
    const borrowingDeviceIds = await this.getBorrowingDeviceIds();

    return [...ownerDeviceIds, ...borrowingDeviceIds];
  }

  async getBorrowingDeviceIds(): Promise<number[]> {
    const borrowRequestInProcess = await this.prisma.borrowRequest.findMany({
      select: {
        deviceId: true,
      },
      where: {
        status: {
          in: [UsingStatus.using, UsingStatus.requesting, UsingStatus.returning],
        },
      },
    });

    return borrowRequestInProcess.map((b: BorrowRequest) => b.deviceId);
  }
}

export async function createNotification(prisma: PrismaClient, borrowRequest: any) {
  let data = {};
  switch (borrowRequest.status) {
    case UsingStatus.returning:
      data = {
        title: 'New borrow request return',
        body: `${borrowRequest?.user?.name} requested to borrow device`,
        targetUri: '/borrows',
      };
    case UsingStatus.using:
      data = {
        title: 'Approved borrow request',
        body: 'Your borrow request has been approved',
        targetUri: '/borrows',
      };
    default:
      data = {
        title: 'New borrow request',
        body: `${borrowRequest?.user?.name} requested to borrow device`,
        targetUri: '/borrows',
      };
  }

  return prisma.userNotification.create({
    data: {
      userId: borrowRequest.user.id,
      ...data,
    },
  });
}

export async function createDummyBorrow(
  prisma: PrismaClient,
  borrowData: any,
): Promise<BorrowRequest | undefined> {
  const borrowFactory = new BorrowFactory(prisma);
  const skip = Math.floor(Math.random() * 10);

  const user = await prisma.user.findFirst({
    skip,
  });

  const devices = await prisma.device.findMany({
    where: {
      NOT: {
        id: {
          in: await borrowFactory.getUsedDeviceIds({ exceptedUserId: user.id }),
        },
        status: {
          equals: DeviceStatus.in_stock,
        },
      },
    },
    skip,
    take: 1,
  });

  const device = devices[0];
  if (!device) return;

  const borrowRequest = await prisma.borrowRequest.create({
    data: {
      device: {
        connect: {
          id: device?.id,
        },
      },
      user: {
        connect: {
          id: user?.id,
        },
      },
      status: UsingStatus.requesting,
      borrowedAt: faker.date.recent({ days: 7 }),
      ...borrowData,
    },
    include: {
      user: true,
    },
  });

  await createNotification(prisma, borrowRequest);

  return borrowRequest;
}

export async function createDummyBorrows(prisma: PrismaClient) {
  const admin = await prisma.user.findFirst({ where: { role: UserRole.admin } });

  if (admin) {
    const requestingBorrow = await createDummyBorrow(prisma, {
      status: UsingStatus.requesting,
    });
    const borrowingBorrow = await createDummyBorrow(prisma, {
      status: UsingStatus.using,
    });
    const rejectedBorrow = await createDummyBorrow(prisma, {
      status: null,
      rejectedAt: faker.date.recent({ days: 6 }),
    });

    const approvedBorrow = await createDummyBorrow(prisma, {
      approvedAt: faker.date.recent({ days: 6 }),
      approver: {
        connect: {
          id: admin.id,
        },
      },
    });

    const confirmReturnBorrow = await createDummyBorrow(prisma, {
      approvedAt: faker.date.recent({ days: 6 }),
      approver: {
        connect: {
          id: admin.id,
        },
      },
      status: UsingStatus.returning,
    });

    const returnedBorrow = await createDummyBorrow(prisma, {
      approvedAt: faker.date.recent({ days: 6 }),
      approver: {
        connect: {
          id: admin.id,
        },
      },
      status: null,
      returnedAt: faker.date.recent({ days: 5 }),
    });
  }
}
