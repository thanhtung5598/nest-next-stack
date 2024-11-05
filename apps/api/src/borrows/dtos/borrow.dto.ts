import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DeviceStatus } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { PaginationParamsDto } from '@/libs/commons/dtos/pagination-params.dto';
import { OrderDirection } from '@/libs/commons/enum';
import { CategoryResponseDto } from '@/categories/dtos/category.dto';
import { BorrowStatus } from '@/libs/commons/enums/borrow';

export class DeviceBorrowDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  sku: string;

  @ApiProperty({ enum: DeviceStatus })
  @Expose()
  status: DeviceStatus;

  @ApiProperty()
  @Expose()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;
}

export class UserInBorrowDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class CreateBorrowParamsDto {
  @ApiProperty()
  @Expose()
  deviceId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Expose()
  note?: string;

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  @Expose()
  borrowedAt: Date;
}

enum BorrowSortField {
  borrowedAt = 'borrowedAt',
  returnedAt = 'returnedAt',
}

export class GetBorrowsQueryDto extends PaginationParamsDto {
  @ApiProperty({ required: false })
  @Expose()
  keyword?: string;

  @ApiProperty({ required: false, enum: BorrowStatus })
  @Expose()
  status?: BorrowStatus;

  @ApiProperty({ required: false, enum: OrderDirection })
  @IsEnum(OrderDirection)
  @IsOptional()
  @Expose()
  sortOrder?: OrderDirection;

  @ApiProperty({ required: false, enum: BorrowSortField })
  @IsEnum(BorrowSortField)
  @IsOptional()
  @Expose()
  sortField?: BorrowSortField;
}

export enum UpdateBorrowProcessType {
  approve = 'approve',
  reject = 'reject',
  confirmReturn = 'confirmReturn',
  requestReturn = 'requestReturn',
}

export class ProcessDataDto {
  @ApiProperty({ required: false })
  @Expose()
  rejectionReason?: string;
}

export class UpdateBorrowProcessParamsDto {
  @ApiProperty({
    enum: UpdateBorrowProcessType,
    required: true,
    default: 'approve | reject | confirmReturn | requestReturn',
  })
  @IsEnum(UpdateBorrowProcessType)
  @Expose()
  @IsNotEmpty()
  type: UpdateBorrowProcessType;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  data: ProcessDataDto;
}
