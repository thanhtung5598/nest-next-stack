import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ApiConfigService } from './api-config.service';
import { firstValueFrom } from 'rxjs';
import { WebhookSlackParamsDto } from '@/libs/commons/dtos/webhook-slack.dto';

@Injectable()
export class WebhookSlackService {
  private slackWebhookUrl: string;
  private readonly logger = new Logger(WebhookSlackService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ApiConfigService,
  ) {
    this.slackWebhookUrl = this.configService.webhookConfig.slackWebhookUrl;
  }

  // Emoji: https://projects.iamcal.com/emoji-data/table.htm
  // Template: https://app.slack.com/block-kit-builder
  async sendToSlack(params: WebhookSlackParamsDto) {
    try {
      const {
        message,
        avatarUrl = 'https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-1035x780.jpg',
        email,
        name,
      } = params;

      await firstValueFrom(
        this.httpService.post(this.slackWebhookUrl, {
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Email: *<mailto:${email}|${email}>*\n:flag-vn: We get a new borrow request from ${name}\n ${message}\nThanks/Arigatoo!`,
              },
              accessory: {
                type: 'image',
                image_url: avatarUrl,
                alt_text: 'alt text for image',
              },
            },
          ],
        }),
      );

      return {
        message: 'success',
      };
    } catch (error: any) {
      this.logger.error('Failed to send Slack message:', error.message);
    }
  }
}
