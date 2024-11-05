import path from 'path';

import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { extension, lookup } from 'mime-types';

import { ApiConfigService } from './api-config.service';
import { IFile } from '@/libs/commons/interfaces';
import { v1 as uuid } from 'uuid';
import { UploadRes } from '@/upload/dtos/upload.dto';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3;

  constructor(public configService: ApiConfigService) {
    const awsS3Config = configService.awsS3Config;

    this.s3 = new S3({
      region: awsS3Config.bucketRegion,
      forcePathStyle: true,
      credentials: {
        accessKeyId: awsS3Config.accessKeyId,
        secretAccessKey: awsS3Config.secretAccessKey,
      },
    });
  }

  async uploadPublicImage(pathS3: string, file: IFile): Promise<UploadRes> {
    const mimeType = lookup(file.originalname);
    const fileExtension = extension(mimeType || '') || path.extname(file.originalname);
    const fileName = `${uuid()}.${fileExtension}`;
    const key = pathS3 + fileName;
    try {
      await this.s3.putObject({
        Bucket: this.configService.awsS3Config.bucketName,
        Body: file.buffer,
        ContentType: mimeType as string,
        Key: key,
      });
      const prefix = this.configService.awsS3Config.cloudfrontPrefix;

      return {
        url: `${prefix}/${key}`,
      };
    } catch (error) {
      throw error;
    }
  }
}
