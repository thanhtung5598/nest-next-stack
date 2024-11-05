import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/libs/shared/services/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  GetAllBorrowDevicesParamsDto,
  GetAllUserDevicesParamsDto,
  GetAllUsersParamsDto,
  UserDeviceRes,
} from './dto/get-users.dto';
import { offsetPaginate, PaginatedResult } from '@/libs/utils/pagination';
import { UserEntity } from './entities/user.entity';
import { BorrowRequest, Prisma, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import {
  IN_KEEPING_DEVICE_STATUSES,
  IN_PROCESS_BORROW_STATUSES,
} from '@/libs/commons/constants/borrow';
import { DeleteUserDeviceParamsDto } from './dto/delete-user-device.dto';
import { OrderDirection } from '@/libs/commons/enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMany(getUsersParamsDto: GetAllUsersParamsDto): Promise<PaginatedResult<UserEntity>> {
    const { keyword, ...rest } = getUsersParamsDto;
    const where: Prisma.UserWhereInput = {};

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    return offsetPaginate(this.prisma.user, {
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        isActive: true,
        avatarUrl: true,
      },
      ...rest,
    });
  }

  async getUserDevices(userId: string, getUsersParamsDto: GetAllUserDevicesParamsDto) {
    const { keyword, ...rest } = getUsersParamsDto;
    const where: Prisma.UserDeviceWhereInput = {};

    await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (keyword) {
      where.device.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    const userDevices = await offsetPaginate<{ device: UserDeviceRes }, { where; select }>(
      this.prisma.userDevice,
      {
        where: {
          userId,
        },
        select: {
          device: {
            select: {
              id: true,
              sku: true,
              name: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              note: true,
            },
          },
        },
        ...rest,
      },
    );

    return {
      data: userDevices.data.map((item) => item.device),
      pagination: userDevices.pagination,
    };
  }

  async getBorrowDevices(
    userId: string,
    getAllBorrowDevicesParamsDto: GetAllBorrowDevicesParamsDto,
  ) {
    const {
      keyword,
      sortField,
      sortOrder = OrderDirection.DESC,
      ...rest
    } = getAllBorrowDevicesParamsDto;
    const where: Prisma.UserDeviceWhereInput = {};
    const orderBy: Prisma.BorrowRequestOrderByWithRelationInput = {};

    await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (keyword) {
      where.device.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    if (sortField) {
      orderBy[sortField] = sortOrder;
    }

    const userDevices = await offsetPaginate<{ device: UserDeviceRes }, { where; select; orderBy }>(
      this.prisma.borrowRequest,
      {
        where: {
          userId,
          status: {
            in: IN_KEEPING_DEVICE_STATUSES,
          },
        },
        orderBy: orderBy,
        select: {
          id: true,
          status: true,
          borrowedAt: true,
          returnedAt: true,
          device: {
            select: {
              id: true,
              sku: true,
              name: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              note: true,
            },
          },
        },
        ...rest,
      },
    );

    return {
      data: userDevices.data,
      pagination: userDevices.pagination,
    };
  }

  async getBorrowDevicesHistory(
    userId: string,
    query: GetAllBorrowDevicesParamsDto,
  ): Promise<PaginatedResult<BorrowRequest>> {
    const { keyword, sortField, sortOrder = OrderDirection.DESC, ...rest } = query;
    const where: Prisma.BorrowRequestWhereInput = {};
    const orderBy: Prisma.BorrowRequestOrderByWithRelationInput = {};

    if (keyword) {
      where.device = {
        is: {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      };
    }

    if (sortField) {
      orderBy[sortField] = sortOrder;
    }

    return offsetPaginate(this.prisma.borrowRequest, {
      where: {
        userId,
        ...where,
      },
      include: {
        device: {
          include: {
            category: true,
          },
        },
        user: true,
      },
      orderBy: orderBy,
      ...rest,
    });
  }

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User Id not found');
    }

    const devicesCount = await this.prisma.userDevice.count({
      where: { userId },
    });

    const borrowDeviceCount = await this.prisma.borrowRequest.count({
      where: {
        userId,
        status: {
          in: IN_KEEPING_DEVICE_STATUSES,
        },
      },
    });

    const borrowHistoryCount = await this.prisma.borrowRequest.count({
      where: { userId },
    });

    return { ...user, devicesCount, borrowDeviceCount, borrowHistoryCount };
  }

  async createUser(body: CreateUserDto) {
    const { email, departmentId } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException('Email already exist');
    }

    await this.prisma.department.findUniqueOrThrow({
      where: {
        id: departmentId,
      },
    });

    return await this.prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        avatarUrl: body.avatarUrl,
        role: UserRole.employee,
        departmentId: body.departmentId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        avatarUrl: true,
        role: true,
        departmentId: true,
      },
    });
  }

  async updateUser(userId: string, body: UpdateUserDto) {
    const { name, email, departmentId, isActive } = body;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User Id not found');
    }

    if (departmentId !== undefined) {
      const department = await this.prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        throw new NotFoundException('Department Id not found');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name,
        departmentId,
        isActive,
      },
      select: {
        email: true,
        name: true,
        departmentId: true,
        isActive: true,
      },
    });

    return updatedUser;
  }

  async addUserDevices(userId: string, deviceIds: number[]) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const devices = await this.prisma.device.findMany({
      where: {
        id: {
          in: deviceIds,
        },
      },
    });

    if (devices.length !== deviceIds.length) {
      const foundDeviceIds = devices.map((device) => device.id);
      const deviceIdsNotFound = deviceIds.filter((deviceId) => !foundDeviceIds.includes(deviceId));
      throw new NotFoundException(`Devices [${deviceIdsNotFound.join(', ')}] not found`);
    }

    const userDevices = await this.prisma.userDevice.findMany({
      where: {
        deviceId: {
          in: deviceIds,
        },
      },
      select: {
        device: {
          select: {
            sku: true,
          },
        },
      },
    });

    if (userDevices.length > 0) {
      const userDevicesSku = userDevices.map((d) => d.device.sku);
      throw new BadRequestException(
        `Devices with SKUs [${userDevicesSku.join(', ')}] are already assigned to other users`,
      );
    }

    const borrowRequests = await this.prisma.borrowRequest.findMany({
      where: {
        deviceId: {
          in: deviceIds,
        },
        status: {
          in: IN_PROCESS_BORROW_STATUSES,
        },
      },
      select: {
        device: {
          select: {
            sku: true,
          },
        },
      },
    });

    if (borrowRequests.length > 0) {
      const borrowRequestsSKUs = borrowRequests.map((d) => d.device.sku);
      throw new BadRequestException(
        `Devices with SKUs [${borrowRequestsSKUs.join(', ')}] are already borrowed to other`,
      );
    }

    const userDeviceData = deviceIds.map((deviceId) => ({
      userId,
      deviceId,
    }));

    return this.prisma.userDevice.createMany({
      data: userDeviceData,
    });
  }

  async deleteUserDevice(userId: string, deleteUserDeviceParamsDto: DeleteUserDeviceParamsDto) {
    const { deviceId } = deleteUserDeviceParamsDto;

    await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    await this.prisma.userDevice.findFirstOrThrow({
      where: {
        deviceId,
      },
    });

    return await this.prisma.userDevice.delete({
      where: {
        userId,
        deviceId,
      },
    });
  }
}
