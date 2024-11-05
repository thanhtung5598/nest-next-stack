import { PaginationParamsDto } from '@/libs/commons/dtos/pagination-params.dto';
import { OffsetPaginationResultDto } from '@/libs/commons/dtos/pagination-result.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserEntity } from '../entities/user.entity';
import { DepartmentEntity } from '@/departments/entities/department.entity';
import { CategoryEntity } from '@/categories/entities/category.entity';
import { UsingStatus } from '@prisma/client';
import { OrderDirection } from '@/libs/commons/enum';
import { IsEnum, IsOptional } from 'class-validator';
import { BorrowStatus } from '@/libs/commons/enums/borrow';

export class GetAllUserRes extends UserEntity {
  @ApiProperty()
  department: DepartmentEntity;
}

export class GetUserRes extends OmitType(UserEntity, ['departmentId']) {
  @ApiProperty()
  department: DepartmentEntity;

  @ApiProperty()
  devicesCount: number;

  @ApiProperty()
  borrowHistoryCount: number;
}

export class GetAllUsersParamsDto extends PaginationParamsDto {
  @ApiProperty({ required: false })
  @Expose()
  keyword?: string;
}

export class GetAllUsersResponseDto extends OffsetPaginationResultDto {
  @ApiProperty({ type: [GetAllUserRes] })
  @Type(() => GetAllUserRes)
  @Expose()
  data: GetAllUserRes[];
}

// Devices

export class UserDeviceRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  category: CategoryEntity;

  @ApiProperty()
  note: string;
}

export class UserBorrowDevicesRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Type(() => Date)
  borrowedAt: Date;

  @ApiProperty()
  @Type(() => Date)
  returnedAt: Date;

  @ApiProperty()
  status: UsingStatus;

  @ApiProperty()
  device: UserDeviceRes;
}

export class GetAllUserDevicesParamsDto extends PaginationParamsDto {
  @ApiProperty({ required: false })
  @Expose()
  keyword?: string;
}

export class GetAllUserDevicesResponseDto extends OffsetPaginationResultDto {
  @ApiProperty({ type: [UserDeviceRes] })
  @Type(() => UserDeviceRes)
  @Expose()
  data: UserDeviceRes[];
}

enum BorrowSortField {
  borrowedAt = 'borrowedAt',
  returnedAt = 'returnedAt',
}

export class GetAllBorrowDevicesParamsDto extends PaginationParamsDto {
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

export class GetAllBorrowDevicesResponseDto extends OffsetPaginationResultDto {
  @ApiProperty({ type: [UserBorrowDevicesRes] })
  @Type(() => UserBorrowDevicesRes)
  @Expose()
  data: UserBorrowDevicesRes[];
}
