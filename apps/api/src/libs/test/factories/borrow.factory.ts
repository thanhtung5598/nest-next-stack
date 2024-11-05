import { faker } from '@faker-js/faker/.';
import { BorrowRequest, Device, User, UsingStatus } from '@prisma/client';
import { prismaInstance } from '@repo/db';

type CreateBorrowParams = {
  status?: UsingStatus;
  borrowedAt?: Date;
};

export async function createBorrowRequest(
  user: User,
  device: Device,
  data?: CreateBorrowParams,
): Promise<BorrowRequest> {
  const createData = {
    status: UsingStatus.requesting,
    note: faker.lorem.lines(),
    user: {
      connect: {
        id: user.id,
      },
    },
    device: {
      connect: {
        id: device.id,
      },
    },
    ...(data || {}),
  };

  return await prismaInstance.borrowRequest.create({
    data: createData,
    include: {
      user: true,
      device: true,
    },
  });
}

export async function setAsUsingBorrow(id: number) {
  return await prismaInstance.borrowRequest.update({
    where: {
      id,
    },
    data: {
      status: UsingStatus.using,
    },
  });
}

export async function setAsReturningBorrow(id: number) {
  return await prismaInstance.borrowRequest.update({
    where: {
      id,
    },
    data: {
      status: UsingStatus.returning,
    },
  });
}
