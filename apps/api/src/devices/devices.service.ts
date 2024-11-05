import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/libs/shared/services/prisma.service';
import { Device, DeviceStatus, Prisma, UsingStatus } from '@prisma/client';
import { offsetPaginate } from '@/libs/utils/pagination';
import {
  CreateDeviceParamsDto,
  GetAvailableDevicesQueryDto,
  GetBorrowableDevicesQueryDto,
  GetDevicesQueryDto,
  UpdateDeviceParamsDto,
  DeviceUsingStatus,
} from './dtos/device.dto';
import { OrderDirection } from '@/libs/commons/enum';
import { IN_PROCESS_BORROW_STATUSES } from '@/libs/commons/constants/borrow';
import { Logger } from '@nestjs/common';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  private deviceIncludeQuery = {
    category: true,
    brand: true,
    userDevice: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    departmentDevice: {
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    },
    requests: {
      select: {
        status: true,
      },
      where: {
        status: { in: IN_PROCESS_BORROW_STATUSES },
      },
      take: 1,
    },
  };

  private getQueryFromUsingStatus(usingStatus: DeviceUsingStatus) {
    switch (usingStatus) {
      case DeviceUsingStatus.using:
        return {
          OR: [
            {
              requests: {
                some: {
                  status: {
                    in: [UsingStatus.using, UsingStatus.returning],
                  },
                },
              },
            },
            {
              userDevice: {
                isNot: null,
              },
            },
          ],
        };
      case DeviceUsingStatus.requesting:
        return {
          requests: {
            some: {
              status: UsingStatus.requesting,
            },
          },
        };
      case DeviceUsingStatus.available:
        return {
          AND: [
            {
              requests: {
                every: {
                  status: null,
                },
              },
            },
            {
              userDevice: {
                is: null,
              },
            },
          ],
        };
      default:
        return {};
    }
  }

  async getList(query: GetDevicesQueryDto) {
    const {
      keyword,
      status,
      sortField,
      sortOrder = OrderDirection.DESC,
      usingStatus,
      ...rest
    } = query;
    let where: Prisma.DeviceWhereInput = {};
    let orderBy: Prisma.DeviceOrderByWithRelationInput = {
      createdAt: OrderDirection.DESC,
    };

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    if (sortField) {
      orderBy = {
        [sortField]: sortOrder,
      };
    }

    if (status) {
      where.status = {
        equals: status,
      };
    }
    if (usingStatus) {
      where = {
        ...where,
        ...this.getQueryFromUsingStatus(usingStatus),
      };
    }

    const prismaQuery = {
      where,
      orderBy,
      ...rest,
    };

    const devicesPaginated = await offsetPaginate<Device, any>(this.prisma.device, {
      ...prismaQuery,
      include: this.deviceIncludeQuery,
    });

    const mappingDataDeviceStatus = devicesPaginated.data.map((device: any) =>
      this.mappingDeviceUsingStatus(device),
    );

    return {
      data: mappingDataDeviceStatus,
      pagination: devicesPaginated.pagination,
    };
  }

  private mappingDeviceUsingStatus(device) {
    const isKeptBy = !!Object.keys(device.userDevice || {}).length;

    const borrowStatus = device.requests?.[0]?.status;
    let status: string;

    if (borrowStatus === UsingStatus.requesting) {
      status = DeviceUsingStatus.requesting;
    } else if (
      borrowStatus === UsingStatus.using ||
      borrowStatus === UsingStatus.returning ||
      isKeptBy
    ) {
      status = DeviceUsingStatus.using;
    } else {
      status = DeviceUsingStatus.available;
    }

    return {
      ...device,
      usingStatus: status,
    };
  }

  async findOne(id: number) {
    const device = await this.prisma.device.findUniqueOrThrow({
      where: { id },
      include: this.deviceIncludeQuery,
    });

    return await this.mappingDeviceUsingStatus(device);
  }

  async create(data: CreateDeviceParamsDto): Promise<Device> {
    const { categoryId, brandId } = data;

    await this.prisma.category.findUniqueOrThrow({
      where: { id: categoryId },
    });

    if (brandId !== undefined) {
      await this.prisma.brand.findUniqueOrThrow({
        where: { id: brandId },
      });
    }

    const createdDevice = await this.prisma.device.create({
      data,
      include: this.deviceIncludeQuery,
    });

    return await this.mappingDeviceUsingStatus(createdDevice);
  }

  async update(id: number, data: UpdateDeviceParamsDto): Promise<Device> {
    const { categoryId, brandId } = data;

    if (categoryId !== undefined) {
      await this.prisma.category.findUniqueOrThrow({
        where: { id: categoryId },
      });
    }

    if (brandId !== undefined) {
      await this.prisma.brand.findUniqueOrThrow({
        where: { id: brandId },
      });
    }

    const updatedDevice = await this.prisma.device.update({
      data,
      where: {
        id,
      },
      include: this.deviceIncludeQuery,
    });

    return await this.mappingDeviceUsingStatus(updatedDevice);
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

    return userDevices.map((_) => _.deviceId);
  }

  private async getBorrowingDeviceIds(): Promise<number[]> {
    const borrowRequestInProcess = await this.prisma.borrowRequest.findMany({
      select: {
        deviceId: true,
      },
      where: {
        status: {
          in: IN_PROCESS_BORROW_STATUSES,
        },
      },
    });

    return borrowRequestInProcess.map((_) => _.deviceId);
  }

  private async getUsedDeviceIds({
    exceptedUserId,
  }: {
    exceptedUserId?: string;
  }): Promise<number[]> {
    const ownerDeviceIds = await this.getOwnerDeviceIds({ exceptedUserId });
    const borrowingDeviceIds = await this.getBorrowingDeviceIds();

    return [...ownerDeviceIds, ...borrowingDeviceIds];
  }

  async getAvailableDevices(query: GetAvailableDevicesQueryDto) {
    const { keyword } = query;
    const where: Prisma.DeviceWhereInput = {};
    const pageSize = 20;

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    return this.prisma.device.findMany({
      where: {
        ...where,
        NOT: {
          id: {
            in: await this.getUsedDeviceIds({}),
          },
          status: {
            equals: DeviceStatus.in_stock,
          },
        },
      },
      select: {
        id: true,
        name: true,
        sku: true,
      },
      orderBy: {
        createdAt: OrderDirection.DESC,
      },
      take: pageSize,
    });
  }

  async getBorrowableDevices(userId: string, query: GetBorrowableDevicesQueryDto) {
    const { keyword } = query;
    const where: Prisma.DeviceWhereInput = {};
    const pageSize = 20;

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    return this.prisma.device.findMany({
      where: {
        ...where,
        NOT: {
          id: {
            in: await this.getUsedDeviceIds({ exceptedUserId: userId }),
          },
          status: {
            equals: DeviceStatus.in_stock,
          },
        },
      },
      select: {
        id: true,
        name: true,
        sku: true,
      },
      orderBy: {
        createdAt: OrderDirection.DESC,
      },
      take: pageSize,
    });
  }

  getNumberOfTotalDevices() {
    return this.prisma.device.count();
  }

  getNumberOfBorrowingDevices() {
    return this.prisma.borrowRequest.count({
      where: {
        status: {
          in: IN_PROCESS_BORROW_STATUSES,
        },
      },
    });
  }

  async getNumberOfDevicesByCategory() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const categoryById = categories.reduce((acc: { [key: number]: string }, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});

    const res = await this.prisma.device.groupBy({
      by: ['categoryId'],
      _count: true,
    });

    return res.map((d) => ({
      name: categoryById[d.categoryId],
      count: d._count,
    }));
  }
}
