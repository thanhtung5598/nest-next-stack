import { Global, Module } from '@nestjs/common';

import { ApiConfigService } from './services/api-config.service';
import { PrismaService } from './services/prisma.service';
import { AwsS3Service } from './services/aws-s3.service';
import { BorrowRequestService } from './services/borrow-request.service';
import { HttpModule } from '@nestjs/axios';
import { WebhookSlackService } from './services/webhook-slack.service';

@Global()
@Module({
  imports: [
    HttpModule,
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 60000, // 1 minute
    //     limit: 20, // maximum number of requests in that time
    //   },
    // ]),
  ],
  providers: [
    PrismaService,
    WebhookSlackService,
    ApiConfigService,
    BorrowRequestService,
    AwsS3Service,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
  exports: [
    PrismaService,
    WebhookSlackService,
    ApiConfigService,
    BorrowRequestService,
    AwsS3Service,
  ],
})
export class SharedModule {}
