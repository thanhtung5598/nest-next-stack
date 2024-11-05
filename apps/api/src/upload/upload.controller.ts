import { IFile } from '@/libs/commons/interfaces';
import { AwsS3Service } from '@/libs/shared/services/aws-s3.service';
import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadParams } from './dtos/upload.dto';
import { ImageUpload } from '@/libs/commons/decorators/image-upload';

@ApiBearerAuth()
@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Post()
  @ApiOperation({
    summary: 'Upload Image',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    type: UploadParams,
  })
  async uploadImage(
    @ImageUpload()
    file: IFile,
  ) {
    const pathS3 = 'uploads/';
    return await this.awsS3Service.uploadPublicImage(pathS3, file);
  }
}
