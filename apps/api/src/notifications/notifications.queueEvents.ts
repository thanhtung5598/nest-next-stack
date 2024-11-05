import { QUEUE_NAMES } from '@/libs/commons/constants/queue';
import { OnQueueEvent, QueueEventsHost, QueueEventsListener } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

@QueueEventsListener(QUEUE_NAMES.NOTIFICATION)
export class NotificationsQueueEvents extends QueueEventsHost {
  private readonly logger = new Logger(NotificationsQueueEvents.name);

  @OnQueueEvent('completed')
  onCompleted({ jobId }: { jobId: string; returnvalue: string; prev?: string }) {
    this.logger.debug('Start completed event...');
    this.logger.debug(jobId);
    this.logger.debug('Finishing completed event');
  }
}
