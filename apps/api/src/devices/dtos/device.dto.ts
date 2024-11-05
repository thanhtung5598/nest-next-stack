import { ApiProperty } from '@nestjs/swagger';
import { Device, DeviceStatus, Prisma } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { CategoryResponseDto } from '@/categories/dtos/category.dto';
import { BrandResponseDto } from '@/brands/dtos/brand.dto';
import { OffsetPaginationResultDto } from '@/libs/commons/dtos/pagination-result.dto';
import { PaginationParamsDto } from '@/libs/commons/dtos/pagination-params.dto';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  NotContains,
} from 'class-validator';
import { OrderDirection } from '@/libs/commons/enum';

export enum DeviceUsingStatus {
  using = 'using',
  requesting = 'requesting',
  available = 'available',
}

export class UserOwnerDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class DepartmentOwnerDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class DeviceResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  sku: string;

  @ApiProperty({ required: false })
  @Expose()
  serialNumber: string;

  @ApiProperty({ required: false, type: Number })
  @Type(() => Number)
  @Expose()
  price: Prisma.Decimal;

  @ApiProperty({ required: false, type: Number })
  @Type(() => Number)
  @Expose()
  priceVat: Prisma.Decimal;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @Expose()
  buyAt: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @Expose()
  usedAt: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @Expose()
  expiredWarrantyAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  imageUrl: string;

  @ApiProperty({ required: false })
  @Expose()
  note: string;

  @ApiProperty({ enum: DeviceStatus })
  @Expose()
  status: DeviceStatus;

  @ApiProperty()
  @Type(() => Date)
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => CategoryResponseDto)
  category: CategoryResponseDto;

  @ApiProperty({ required: false })
  @Expose()
  @Type(() => BrandResponseDto)
  brand: BrandResponseDto;

  @ApiProperty({ required: false })
  @Expose()
  model: string;

  @ApiProperty({ required: false, type: UserOwnerDto })
  @Expose()
  @Type(() => UserOwnerDto)
  @Transform(({ obj }) => obj.userDevice?.user || null)
  userOwner: UserOwnerDto;

  @ApiProperty({ required: false, type: DepartmentOwnerDto })
  @Expose()
  @Type(() => DepartmentOwnerDto)
  @Transform(({ obj }) => obj.departmentDevice?.department || null)
  departmentOwner: DepartmentOwnerDto;

  @ApiProperty({ default: Object.values(DeviceUsingStatus).join(', ') })
  @Expose()
  usingStatus: DeviceUsingStatus;
}

export class GetDevicesResponseDto extends OffsetPaginationResultDto {
  @ApiProperty({ type: [DeviceResponseDto] })
  @Type(() => DeviceResponseDto)
  @Expose()
  data: DeviceResponseDto[];
}

enum DeviceSortField {
  buyAt = 'buyAt',
  price = 'price',
  priceVat = 'priceVat',
}

export class GetDevicesQueryDto extends PaginationParamsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Expose()
  keyword?: string;

  @ApiProperty({ required: false, enum: DeviceStatus })
  @IsOptional()
  @Expose()
  status?: DeviceStatus;

  @ApiProperty({ required: false, enum: DeviceUsingStatus })
  @IsOptional()
  @Expose()
  usingStatus?: DeviceUsingStatus;

  @ApiProperty({ required: false, enum: OrderDirection })
  @IsEnum(OrderDirection)
  @IsOptional()
  @Expose()
  sortOrder?: OrderDirection;

  @ApiProperty({ required: false, enum: DeviceSortField })
  @IsEnum(DeviceSortField)
  @IsOptional()
  @Expose()
  sortField?: DeviceSortField;
}

export class CreateDeviceParamsDto implements Omit<Device, 'id' | 'createdAt' | 'updatedAt'> {
  @ApiProperty()
  @IsString()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  sku: string;

  @ApiProperty({ required: false })
  @IsString()
  @Expose()
  @NotContains(' ')
  @IsOptional()
  serialNumber: string;

  @ApiProperty({ required: false, type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Expose()
  price: Prisma.Decimal;

  @ApiProperty({ required: false, type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Expose()
  priceVat: Prisma.Decimal;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  buyAt: Date;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  usedAt: Date;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  expiredWarrantyAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsUrl()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  note: string;

  @ApiProperty({ enum: DeviceStatus, required: false, default: DeviceStatus.in_stock })
  @IsEnum(DeviceStatus)
  @Expose()
  status: DeviceStatus;

  @ApiProperty()
  @Expose()
  @IsInt()
  categoryId: number;

  @ApiProperty({ required: false })
  @Expose()
  @IsInt()
  @IsOptional()
  brandId: number;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsOptional()
  model: string;
}

export class UpdateDeviceParamsDto implements CreateDeviceParamsDto {
  @ApiProperty({ required: false })
  @IsString()
  @Expose()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  @IsOptional()
  sku: string;

  @ApiProperty({ required: false })
  @IsString()
  @Expose()
  @NotContains(' ')
  @IsOptional()
  serialNumber: string;

  @ApiProperty({ required: false, type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Expose()
  price: Prisma.Decimal;

  @ApiProperty({ required: false, type: Number })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Expose()
  priceVat: Prisma.Decimal;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  buyAt: Date;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  usedAt: Date;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Expose()
  expiredWarrantyAt: Date;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsUrl()
  @IsOptional()
  imageUrl: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty({ enum: DeviceStatus, required: false })
  @IsEnum(DeviceStatus)
  @Expose()
  @IsOptional()
  status: DeviceStatus;

  @ApiProperty({ required: false })
  @Expose()
  @IsInt()
  @IsOptional()
  categoryId: number;

  @ApiProperty({ required: false })
  @Expose()
  @IsInt()
  @IsOptional()
  brandId: number;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsOptional()
  model: string;
}

export class GetAvailableDevicesQueryDto {
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  keyword?: string;
}

export class AvailableDeviceDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  sku: string;
}

export class GetAvailableDevicesResDto {
  @ApiProperty({ type: [AvailableDeviceDto] })
  @Type(() => AvailableDeviceDto)
  @Expose()
  data: AvailableDeviceDto[];
}

export class GetBorrowableDevicesQueryDto {
  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  keyword?: string;
}

export class BorrowableDeviceDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  sku: string;
}

export class GetBorrowableDevicesResDto {
  @ApiProperty({ type: [BorrowableDeviceDto] })
  @Type(() => BorrowableDeviceDto)
  @Expose()
  data: BorrowableDeviceDto[];
}
