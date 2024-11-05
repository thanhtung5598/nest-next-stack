import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WebhookSlackParamsDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  avatarUrl: string;
}
