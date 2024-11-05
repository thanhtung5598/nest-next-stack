import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginationParamsDto } from '@/libs/commons/dtos/pagination-params.dto';
import { OffsetPaginationResultDto } from '@/libs/commons/dtos/pagination-result.dto';
import { BrandEntity } from '../entities/brand.entity';

export class BrandResponseDto extends BrandEntity {}

export class GetBrandsParamsDto extends PaginationParamsDto {
  @ApiProperty({ required: false })
  keyword?: string;
}

export class GetBrandsResponseDto extends OffsetPaginationResultDto {
  @ApiProperty({ type: [BrandResponseDto] })
  @Type(() => BrandResponseDto)
  @Expose()
  data: BrandResponseDto[];
}
