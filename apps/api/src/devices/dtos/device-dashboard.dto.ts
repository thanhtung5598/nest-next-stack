import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class DeviceCategoryDto {
  @ApiProperty()
  @Expose()
  name: number;

  @ApiProperty()
  @Expose()
  count: number;
}

export class DeviceStatisticDto {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  borrowing: number;

  @ApiProperty({ type: [DeviceCategoryDto] })
  @Type(() => DeviceCategoryDto)
  @Expose()
  deviceByCategory: DeviceCategoryDto[];
}
