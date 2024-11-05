import { TokenAsyncDto } from '@/auth/dto/token-async.dt';
import { WsExceptionsFilter } from '@/libs/exceptions/ws-exception-filter';
import { ApiConfigService } from '@/libs/shared/services/api-config.service';
import { Logger, OnModuleInit, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '@prisma/client';
import { PrismaService } from '@/libs/shared/services/prisma.service';

const CHANNEL_NAME = 'notification';
enum NOTIFICATION_ACTION {
  readNotification = 'read-notification',
}

enum MESSAGE_TYPE {
  newNotification = 'new-notification',
  markAsReadSuccess = 'mark-as-read-success',
}

@WebSocketGateway({
  namespace: '/api/ws',
  cors: [
    {
      origin: '*',
    },
  ],
})
@UseFilters(new WsExceptionsFilter())
export class NotificationsGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private prisma: PrismaService,
  ) {}
  private logger = new Logger(NotificationsGateway.name);
  private userSockets = new Map<User['id'], Set<string>>();

  private async extractUserIdFromToken(socket: Socket): Promise<User['id'] | undefined> {
    const token = socket.handshake.auth.token;

    if (!token) {
      this.logger.error('Missing token');
      return undefined;
    }
    const payloadUser: TokenAsyncDto = await this.jwtService.verifyAsync(token, {
      secret: this.configService.authConfig.privateKey,
    });

    if (!payloadUser?.id) {
      this.logger.error('Extract user id failed');
      return undefined;
    }

    return payloadUser.id;
  }

  onModuleInit() {
    this.logger.log('Initializing Websocket server');
  }

  async handleConnection(socket: Socket) {
    this.logger.log('New connection', socket.id);
    try {
      const userId = await this.extractUserIdFromToken(socket);

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set<string>());
      }
      this.userSockets.get(userId).add(socket.id);

      this.server.to(socket.id).emit(CHANNEL_NAME, {
        type: 'welcome',
      });
    } catch (error) {
      this.logger.error('Authentication error', {
        error,
      });
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log('Client disconnect ' + socket.id);

    try {
      const userId = await this.extractUserIdFromToken(socket);
      const userSocketIds = this.userSockets.get(userId);
      if (userSocketIds) {
        userSocketIds.delete(socket.id);
        if (userSocketIds.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    } catch (err) {
      socket.disconnect();
    }
  }

  sendNotificationToUser(userId: string, data) {
    try {
      this.sendMessageToUser(userId, MESSAGE_TYPE.newNotification, data);
    } catch (error) {
      this.logger.error(error);
    }
  }

  sendMessageToUser(userId: string, type: MESSAGE_TYPE, data) {
    try {
      this.logger.log('Send message to user ' + userId);

      if (!this.userSockets.has(userId)) {
        return;
      }

      const socketIds = this.userSockets.get(userId);

      socketIds.forEach((socketId) => {
        this.logger.log('sending the message to socketId: ', socketId);
        this.server.to(socketId).emit(CHANNEL_NAME, {
          type,
          data,
        });
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage(CHANNEL_NAME)
  async handleNotificationEvent(socket: Socket, payload) {
    const { action, data } = payload;

    switch (action) {
      case NOTIFICATION_ACTION.readNotification:
        const { notificationId } = data;
        try {
          const userId = await this.extractUserIdFromToken(socket);
          this.logger.log(`Notification ${notificationId} as read by user ${userId}`);
          this.markNotificationAsRead(notificationId, userId);
          this.sendMessageToUser(userId, MESSAGE_TYPE.markAsReadSuccess, {
            notificationId,
            isRead: true,
          });
        } catch (err) {
          this.logger.error(err);
        }
        break;

      default:
        this.logger.error(`Not implemented the action: ${action}`);
    }
  }

  private async markNotificationAsRead(id: number, userId: User['id']) {
    try {
      if (!id) {
        this.logger.error('Missing notificationId when set notification as read', id);
      }
      const userNotification = await this.prisma.userNotification.findUnique({
        where: { id, userId },
        select: {
          checkedAt: true,
        },
      });

      if (!userNotification || userNotification.checkedAt) return userNotification;

      return this.prisma.userNotification.update({
        where: {
          id,
        },
        data: {
          checkedAt: new Date(),
        },
        select: {
          id: true,
          checkedAt: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
