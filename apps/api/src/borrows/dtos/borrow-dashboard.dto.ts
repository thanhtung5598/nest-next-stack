import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DeviceBorrowStatisticParamsDto {
  @ApiProperty()
  @Expose()
  type: string;
}

export class DeviceBorrowStatisticResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  request: number;

  @ApiProperty()
  @Expose()
  return: number;
}
