import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/libs/shared/services/prisma.service';
import { CreateBorrowParamsDto } from './dtos/borrow.dto';
import { UsingStatus, BorrowRequest, Prisma, User } from '@prisma/client';
import BorrowEntity from './entiries/borrow.entity';
import { plainToClass } from 'class-transformer';
import { IN_PROCESS_BORROW_STATUSES } from '@/libs/commons/constants/borrow';
import { NotificationsService } from '@/notifications/notifications.service';
import { WebhookSlackService } from '@/libs/shared/services/webhook-slack.service';
import { ApiConfigService } from '@/libs/shared/services/api-config.service';
import { groupBy, getLast12Months, getLast30Days } from '@/libs/utils/utils';

@Injectable()
export class BorrowsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
    private webhookSlackService: WebhookSlackService,
    private configService: ApiConfigService,
  ) {}

  private async getBorrowEntity(id: BorrowRequest['id']): Promise<BorrowEntity> {
    const borrowRequest = await this.prisma.borrowRequest.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return plainToClass(BorrowEntity, borrowRequest);
  }

  async findOne(id: BorrowRequest['id']) {
    return await this.prisma.borrowRequest.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        user: true,
        device: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async create(userId: User['id'], data: CreateBorrowParamsDto) {
    const { deviceId, ...borrowData } = data;

    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    const device = await this.prisma.device.findUniqueOrThrow({
      include: {
        _count: {
          select: {
            requests: {
              where: {
                status: {
                  in: IN_PROCESS_BORROW_STATUSES,
                },
              },
            },
          },
        },
      },
      where: {
        id: deviceId,
      },
    });

    if (device._count.requests > 0) {
      throw new BadRequestException(`The device id=${deviceId} is in borrow process`);
    }

    const keptByOtherUserDeviceCount = await this.prisma.userDevice.count({
      where: {
        deviceId,
        NOT: {
          userId,
        },
      },
    });

    if (keptByOtherUserDeviceCount > 0) {
      throw new BadRequestException(`The device id=${deviceId} is kept by another user`);
    }

    const createdBorrow = await this.prisma.borrowRequest.create({
      data: {
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
        ...borrowData,
        status: UsingStatus.requesting,
      },
      include: {
        user: true,
        device: true,
      },
    });

    this.notificationsService.createForNewBorrow(createdBorrow.id);

    this.webhookSlackService.sendToSlack({
      avatarUrl: createdBorrow.user?.avatarUrl ?? undefined,
      email: createdBorrow.user?.email,
      name: createdBorrow.user?.name,
      message: `${this.configService.globalConfig.frontEndHost}/users/${createdBorrow.user?.id}/borrows`,
    });

    return createdBorrow;
  }

  async approve(id: BorrowRequest['id'], approverId: User['id']) {
    const borrowEntity = await this.getBorrowEntity(id);

    if (!borrowEntity.canApprove()) {
      throw new BadRequestException('Can not approve this request');
    }

    const approvedBorrow = await this.prisma.borrowRequest.update({
      where: {
        id: borrowEntity.id,
      },
      data: {
        status: UsingStatus.using,
        approvedAt: new Date(),
        approvedBy: approverId,
      },
      include: {
        user: true,
        device: true,
        approver: true,
      },
    });

    this.notificationsService.createForApproveBorrow(approvedBorrow.id);

    return approvedBorrow;
  }

  async reject(id: BorrowRequest['id'], rejectionReason?: string) {
    const borrowEntity = await this.getBorrowEntity(id);

    if (!borrowEntity.canReject()) {
      throw new BadRequestException('Can not reject this request');
    }

    return await this.prisma.borrowRequest.update({
      where: {
        id: borrowEntity.id,
      },
      data: {
        status: null,
        rejectedAt: new Date(),
        rejectionReason,
      },
      include: {
        user: true,
        device: true,
      },
    });
  }

  async requestReturn(id: BorrowRequest['id'], userRequestId: string) {
    const borrowEntity = await this.getBorrowEntity(id);

    if (borrowEntity.userId !== userRequestId) {
      throw new UnauthorizedException('User is not request owner');
    }

    if (!borrowEntity.canRequestReturn()) {
      throw new BadRequestException('Can not request return this borrow request');
    }

    const requestBorrow = await this.prisma.borrowRequest.update({
      where: {
        id: borrowEntity.id,
      },
      data: {
        status: UsingStatus.returning,
      },
      include: {
        user: true,
        device: true,
      },
    });

    this.notificationsService.createForRequestReturnBorrow(requestBorrow.id);

    return requestBorrow;
  }

  async confirmReturn(id: BorrowRequest['id']) {
    const borrowEntity = await this.getBorrowEntity(id);

    if (!borrowEntity.canConfirmReturn()) {
      throw new BadRequestException('Can not confirm return this borrow request');
    }

    const returnedBorrow = await this.prisma.borrowRequest.update({
      where: {
        id: borrowEntity.id,
      },
      data: {
        status: null,
        returnedAt: new Date(),
      },
      include: {
        user: true,
        device: true,
      },
    });

    this.notificationsService.createForConfirmReturnBorrow(returnedBorrow.id);

    return returnedBorrow;
  }

  async getBorrowDevicesByMonth() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const res = await this.prisma.borrowRequest.findMany({
      where: {
        borrowedAt: {
          gt: oneYearAgo,
        },
      },
      select: {
        borrowedAt: true,
        returnedAt: true,
        status: true,
      },
    });

    const monthList = getLast12Months();
    const monthByIndex = monthList.reduce((acc, cur) => {
      acc[cur.index] = cur.name;
      return acc;
    }, {});

    const key = (date: Date) => {
      if (!date) return 0;
      return monthByIndex[date.getMonth() + 1];
    };
    const requestByMonth = groupBy(res, (item) => key(item.borrowedAt));
    const returnByMonth = groupBy(res, (item) => key(item.returnedAt));

    return monthList.map((m) => ({
      name: m.name,
      request: requestByMonth[m.name]?.length || 0,
      return: returnByMonth[m.name]?.length || 0,
    }));
  }

  async getBorrowDevicesByDay() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const res = await this.prisma.borrowRequest.findMany({
      where: {
        borrowedAt: {
          gt: oneMonthAgo,
        },
      },
      select: {
        borrowedAt: true,
        returnedAt: true,
        status: true,
      },
    });

    const dayList = getLast30Days();

    const key = (date: Date) => {
      if (!date) return 0;
      return `${date.getDate()}`;
    };
    const requestByMonth = groupBy(res, (item) => key(item.borrowedAt));
    const returnByMonth = groupBy(res, (item) => key(item.returnedAt));

    return dayList.map((m) => ({
      name: m,
      request: requestByMonth[m]?.length || 0,
      return: returnByMonth[m]?.length || 0,
    }));
  }
}
