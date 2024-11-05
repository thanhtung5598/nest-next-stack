import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/libs/commons/decorators/current-user';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationsService } from './notifications.service';
import { GetNotificationsQueryDto, GetNotificationsResponseDto } from './dtos/notifications.dto';
import { Serialize } from '@/libs/commons/interceptors/serialize.interceptor';
import { CursorPaginateQueryDto } from '@/libs/commons/dtos/pagination-params.dto';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    @InjectQueue('notification') private notificationQueue: Queue,
    private notificationsService: NotificationsService,
  ) {}

  @Post('/ping')
  ping() {
    this.notificationsService.createForNewBorrow(7);
  }

  @Get()
  @ApiOperation({ summary: 'Get list current user notifications' })
  @ApiOkResponse({ type: GetNotificationsResponseDto })
  @Serialize(GetNotificationsResponseDto)
  async getList(@CurrentUser() user: any, @Query() query: GetNotificationsQueryDto) {
    const { id: userId } = user;
    const notificationsWithPagination = await this.notificationsService.getList(userId, query);
    const unreadNotificationCount =
      await this.notificationsService.getUnreadNotificationCount(userId);

    return {
      ...notificationsWithPagination,
      unreadNotificationCount,
    };
  }
}
