import { QUEUE_NAMES } from '@/libs/commons/constants/queue';
import { PrismaService } from '@/libs/shared/services/prisma.service';
import { NotificationsService } from '@/notifications/notifications.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, NotImplementedException } from '@nestjs/common';
import { Job } from 'bullmq';
import { User, UserNotification, UserRole } from '@prisma/client';
import {
  ADMIN_BORROW_MANAGEMENT_PATH,
  EMPLOYEE_BORROW_MANAGEMENT_PATH,
} from '@/libs/commons/constants/path';
import { BorrowStatus } from '@/libs/commons/enums/borrow';

@Processor(QUEUE_NAMES.NOTIFICATION)
export class NotificationsProcessor extends WorkerHost {
  private logger = new Logger(NotificationsProcessor.name);
  constructor(
    private notificationsService: NotificationsService,
    private prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'ping':
        return this.ping(job.data);
      case 'create_notification_for_new_borrow':
        return this.createNotificationForNewBorrow(job.data);
      case 'create_notification_for_approved_borrow':
        return this.createNotificationForApprovedBorrow(job.data);
      case 'create_notification_for_rejected_borrow':
        return this.createNotificationForRejectedBorrow(job.data);
      case 'create_notification_for_request_return_borrow':
        return this.createNotificationForRequestReturnBorrow(job.data);
      case 'create_notification_for_confirm_return_borrow':
        return this.createNotificationForConfirmReturnBorrow(job.data);
      default:
        throw new NotImplementedException();
    }
  }

  ping(data) {
    this.notificationsService.sendTestNotification(data.userId);
  }

  private async getBorrowWithUserFromData(data) {
    const { borrowId } = data;
    if (!borrowId) return;

    return await this.prisma.borrowRequest.findUnique({
      where: {
        id: borrowId,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  private async getAdminIds(): Promise<User['id'][]> {
    const admins = await this.prisma.user.findMany({
      where: {
        role: UserRole.admin,
      },
      select: {
        id: true,
      },
    });

    return admins.map((user) => user.id);
  }

  private async createNotificationForAllAdmins(data: any): Promise<UserNotification[]> {
    const adminIds = await this.getAdminIds();

    const notifications = await Promise.all(
      adminIds.map((adminId) => {
        return this.prisma.userNotification.create({
          data: {
            userId: adminId,
            ...data,
          },
        });
      }),
    );

    notifications.map((notification) =>
      this.notificationsService.sendNotification(notification.id),
    );

    return notifications;
  }

  async createNotificationForNewBorrow(data) {
    const borrowWithUser = await this.getBorrowWithUserFromData(data);
    if (!borrowWithUser || !borrowWithUser.user) return;

    const notificationData = {
      title: 'New borrow request',
      body: `${borrowWithUser.user.name} requested to borrow device`,
      targetUri: `/users/${borrowWithUser.user.id}${ADMIN_BORROW_MANAGEMENT_PATH}?status=${BorrowStatus.requesting}`,
    };

    return this.createNotificationForAllAdmins(notificationData);
  }

  async createNotificationForRequestReturnBorrow(data) {
    const borrowWithUser = await this.getBorrowWithUserFromData(data);
    if (!borrowWithUser || !borrowWithUser.user) return;

    const notificationData = {
      title: 'New borrow request return',
      body: `${borrowWithUser.user.name} requested to return the borrow device`,
      targetUri: `/users/${borrowWithUser.user.id}${ADMIN_BORROW_MANAGEMENT_PATH}?status=${BorrowStatus.returnConfirm}`,
    };

    return this.createNotificationForAllAdmins(notificationData);
  }

  private async createNotificationForEmployee(data: any): Promise<UserNotification> {
    const notification = await this.prisma.userNotification.create({
      data,
    });

    this.notificationsService.sendNotification(notification.id);

    return notification;
  }

  async createNotificationForApprovedBorrow(data) {
    const borrowWithUser = await this.getBorrowWithUserFromData(data);
    if (!borrowWithUser || !borrowWithUser.user) return;

    return await this.createNotificationForEmployee({
      title: 'Approved borrow request',
      body: 'Your borrow request has been approved',
      targetUri: `${EMPLOYEE_BORROW_MANAGEMENT_PATH}?status=${BorrowStatus.borrowing}`,
      userId: borrowWithUser.user.id,
    });
  }

  async createNotificationForRejectedBorrow(data) {
    const borrowWithUser = await this.getBorrowWithUserFromData(data);
    if (!borrowWithUser || !borrowWithUser.user) return;

    return await this.createNotificationForEmployee({
      title: 'Reject borrow request',
      body: 'Your borrow request has been rejected',
      targetUri: `/${EMPLOYEE_BORROW_MANAGEMENT_PATH}?status=${BorrowStatus.rejected}`,
      userId: borrowWithUser.user.id,
    });
  }

  async createNotificationForConfirmReturnBorrow(data) {
    const borrowWithUser = await this.getBorrowWithUserFromData(data);
    if (!borrowWithUser || !borrowWithUser.user) return;

    return await this.createNotificationForEmployee({
      title: 'Confirmed request return',
      body: 'Your request return the borrowed device has been confirmed',
      targetUri: `${EMPLOYEE_BORROW_MANAGEMENT_PATH}?status=${BorrowStatus.returned}`,
      userId: borrowWithUser.user.id,
    });
  }
}
