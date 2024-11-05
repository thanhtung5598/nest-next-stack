import { env } from '@/libs/constant';
import { IUserProfile } from './user';

export type INotification = {
  id: string;
  avatarUrl: string;
  title: string;
  body: string;
  targetUri: string;
  isRead: false;
  notifiedAt: string;
  absoluteTargetUrl: string;
  checkedAt: string;
  user: IUserProfile;
};

class NotificationService {
  public baseUrl = `${env?.basePath}/api/notifications`;
}

export const notificationService = new NotificationService();
