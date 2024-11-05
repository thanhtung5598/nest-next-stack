import { ApiProperty } from '@nestjs/swagger';

export class UploadParams {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar image (limit: 5MB)',
  })
  file: any;
}

export class UploadRes {
  @ApiProperty()
  url: string;
}
