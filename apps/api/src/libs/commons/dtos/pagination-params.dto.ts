import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginateBaseParams } from '@/libs/utils/pagination';
import { ApiProperty } from '@nestjs/swagger';
import { CursorPaginateQuery } from '@/libs/utils/cursor-pagination';

export class PaginationParamsDto implements PaginateBaseParams {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number;
}

export class CursorPaginateQueryDto implements CursorPaginateQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  lastEndCursor?: number | string;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number;
}
