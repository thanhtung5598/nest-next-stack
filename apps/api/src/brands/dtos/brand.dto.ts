import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BrandResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}