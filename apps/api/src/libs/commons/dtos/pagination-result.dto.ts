import { CursorPaginate } from '@/libs/utils/cursor-pagination';
import { PaginateBaseResult } from '@/libs/utils/pagination';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OffsetPaginationDto implements PaginateBaseResult {
  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  pageSize: number;

  @ApiProperty()
  @Expose()
  hasMore: boolean;

  @ApiProperty()
  @Expose()
  currentPage: number;

  @ApiProperty()
  @Expose()
  totalPage: number;
}

export class OffsetPaginationResultDto {
  @ApiProperty({ type: OffsetPaginationDto })
  @Expose()
  pagination: OffsetPaginationDto;
}

export class CursorPaginationDto implements CursorPaginate {
  @ApiProperty()
  @Expose()
  endCursor: number;

  @ApiProperty()
  @Expose()
  pageSize: number;

  @ApiProperty()
  @Expose()
  hasMore: boolean;

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  totalPage: number;
}

export class CursorPaginationResultDto {
  @ApiProperty({ type: CursorPaginationDto })
  @Expose()
  pagination: CursorPaginationDto;
}
