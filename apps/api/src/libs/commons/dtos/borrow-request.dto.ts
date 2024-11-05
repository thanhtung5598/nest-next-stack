import { ApiProperty } from '@nestjs/swagger';
import { OffsetPaginationResultDto } from './pagination-result.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { UsingStatus } from '@prisma/client';
import { DeviceBorrowDto, UserInBorrowDto } from '@/borrows/dtos/borrow.dto';
import { BorrowStatus } from '../enums/borrow';

const UsingStatusMapBorrowStatus = {
  [UsingStatus.requesting]: BorrowStatus.requesting,
  [UsingStatus.using]: BorrowStatus.borrowing,
  [UsingStatus.returning]: BorrowStatus.returnConfirm,
};

export class BorrowRequestResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  @Type(() => DeviceBorrowDto)
  device: DeviceBorrowDto;

  @ApiProperty()
  @Expose()
  @Type(() => UserInBorrowDto)
  user: UserInBorrowDto;

  @ApiProperty({ required: false })
  @Expose()
  @Type(() => UserInBorrowDto)
  approver: UserInBorrowDto;

  @ApiProperty({ required: false })
  @Expose()
  note: string;

  @ApiProperty({ required: false })
  @Expose()
  rejectionReason: string;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @Expose()
  borrowedAt: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @Expose()
  returnedAt: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @Expose()
  approvedAt: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @Expose()
  rejectedAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @Expose()
  updatedAt: Date;

  @ApiProperty({ default: Object.values(BorrowStatus).join(', ') })
  @Expose()
  @Transform(({ obj }) => {
    const { status, rejectedAt, returnedAt } = obj || {};
    if (!!rejectedAt) return BorrowStatus.rejected;
    if (!!returnedAt) return BorrowStatus.returned;

    const borrowStatus = status ? UsingStatusMapBorrowStatus[status] : undefined;
    if (borrowStatus) return borrowStatus;

    return BorrowStatus.returned;
  })
  status: BorrowStatus;
}

export class GetBorrowRequestResponseDto extends OffsetPaginationResultDto {
  @ApiProperty({ type: [BorrowRequestResponseDto] })
  @Type(() => BorrowRequestResponseDto)
  @Expose()
  data: BorrowRequestResponseDto[];
}
