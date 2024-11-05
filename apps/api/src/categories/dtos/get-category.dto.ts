import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../entities/category.entity';
import { Expose, Type } from 'class-transformer';
import { PaginationParamsDto } from '@/libs/commons/dtos/pagination-params.dto';
import { OffsetPaginationResultDto } from '@/libs/commons/dtos/pagination-result.dto';

export class GetCategoriesParamsDto extends PaginationParamsDto {
  @ApiProperty({ required: false })
  keyword?: string;
}

export class CategoryResponseDto extends CategoryEntity {}

export class GetCategoriesResponseDto extends OffsetPaginationResultDto {
  @ApiProperty({ type: [CategoryResponseDto] })
  @Type(() => CategoryResponseDto)
  @Expose()
  data: CategoryResponseDto[];
}

export class GetAllCategoriesParamsDto {
  @ApiProperty({ required: false })
  keyword?: string;
}

export class GetAllCategoriesResponseDto {
  @ApiProperty({ type: [CategoryEntity] })
  @Type(() => CategoryEntity)
  @Expose()
  data: CategoryEntity[];
}
