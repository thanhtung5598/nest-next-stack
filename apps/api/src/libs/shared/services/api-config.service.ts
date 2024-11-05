import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  private get(key: string) {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  public getNumber(key: string) {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  get globalConfig() {
    return {
      frontEndHost: this.configService.get('FRONT_END_HOST'),
    };
  }

  get webhookConfig() {
    return {
      slackWebhookUrl: this.configService.get('SLACK_WEBHOOK_URL'),
    };
  }

  get awsS3Config() {
    return {
      cloudfrontPrefix: this.configService.get('COULD_FRONT_PREFIX'),
      bucketRegion: this.configService.get('AWS_S3_BUCKET_REGION'),
      bucketName: this.configService.get('AWS_S3_BUCKET_NAME'),
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
    };
  }

  get googleConfig() {
    return {
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_SECRET'),
      callbackURL: this.configService.get('GOOGLE_OAUTH_CALLBACK_URL'),
    };
  }
  get authConfig() {
    return {
      privateKey: this.configService.get('JWT_PRIVATE_KEY'),
      publicKey: this.configService.get('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
      jwtExpirationRefreshTokenTime: this.getNumber('JWT_EXPIRATION_REFRESH_TOKEN_TIME'),
    };
  }
}
