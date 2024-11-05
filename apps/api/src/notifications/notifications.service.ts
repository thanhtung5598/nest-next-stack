import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaService } from '@/libs/shared/services/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CursorPaginateQueryDto } from '@/libs/commons/dtos/pagination-params.dto';
import { cursorPaginate } from '@/libs/utils/cursor-pagination';
import { User } from '@prisma/client';
import { OrderDirection } from '@/libs/commons/enum';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsGateway: NotificationsGateway,
    private readonly prisma: PrismaService,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  async sendTestNotification(userId: string) {
    this.notificationsGateway.sendNotificationToUser(userId, 'Ping');
  }

  async sendNotification(notificationId: number) {
    const notification = await this.prisma.userNotification.findUnique({
      where: {
        id: notificationId,
      },
      include: {
        user: true,
      },
    });
    if (!notification || !!notification.notifiedAt) return;

    const notifiedAt = new Date();

    this.prisma.userNotification.update({
      where: {
        id: notification.id,
      },
      data: {
        notifiedAt,
      },
    });

    this.notificationsGateway.sendNotificationToUser(notification.userId, {
      id: notification.id,
      title: notification.title,
      body: notification.body,
      targetUri: notification.targetUri,
      notifiedAt,
      user: notification.user,
      isRead: !!notification.checkedAt,
    });
  }

  createForNewBorrow(borrowId: number) {
    this.notificationQueue.add('create_notification_for_new_borrow', {
      borrowId,
    });
  }

  createForApproveBorrow(borrowId: number) {
    this.notificationQueue.add('create_notification_for_approved_borrow', {
      borrowId,
    });
  }

  createForRejectBorrow(borrowId: number) {
    this.notificationQueue.add('create_notification_for_rejected_borrow', {
      borrowId,
    });
  }

  createForRequestReturnBorrow(borrowId: number) {
    this.notificationQueue.add('create_notification_for_request_return_borrow', {
      borrowId,
    });
  }

  createForConfirmReturnBorrow(borrowId: number) {
    this.notificationQueue.add('create_notification_for_confirm_return_borrow', {
      borrowId,
    });
  }

  async getList(userId: User['id'], query: CursorPaginateQueryDto) {
    return cursorPaginate(this.prisma.userNotification, {
      where: {
        userId,
      },
      orderBy: {
        createdAt: OrderDirection.DESC,
      },
      ...query,
    });
  }

  async getUnreadNotificationCount(userId: User['id']) {
    return this.prisma.userNotification.count({
      where: {
        checkedAt: null,
        userId,
      },
    });
  }
}
