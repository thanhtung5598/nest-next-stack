import { PaginationParamsDto } from '@/libs/commons/dtos/pagination-params.dto';
import { OffsetPaginationResultDto } from '@/libs/commons/dtos/pagination-result.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DepartmentEntity } from '../entities/department.entity';
import { Expose, Type } from 'class-transformer';

export class GetDepartmentsParamsDto extends PaginationParamsDto {
  @ApiProperty({ required: false })
  keyword?: string;
}

export class DepartmentResponseDto extends DepartmentEntity {}

export class GetDepartmentsResponseDto extends OffsetPaginationResultDto {
  @ApiProperty({ type: [DepartmentResponseDto] })
  @Type(() => DepartmentResponseDto)
  @Expose()
  data: DepartmentResponseDto[];
}

export class GetAllDepartmentsParamsDto {
  @ApiProperty({ required: false })
  keyword?: string;
}

export class GetAllDepartmentsResponseDto {
  @ApiProperty({ type: [DepartmentResponseDto] })
  @Type(() => DepartmentResponseDto)
  @Expose()
  data: DepartmentResponseDto[];
}
