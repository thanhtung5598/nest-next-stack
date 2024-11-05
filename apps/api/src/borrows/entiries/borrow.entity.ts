import { UserEntity } from '@/users/entities/user.entity';
import { BorrowRequest, UsingStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export default class BorrowEntity implements Partial<BorrowRequest> {
  @Expose()
  id?: number;

  @Expose()
  userId?: string;

  @Expose()
  note?: string;

  @Expose()
  borrowedAt?: Date;

  @Expose()
  returnedAt?: Date;

  @Expose()
  status?: UsingStatus;

  @Expose()
  approvedAt?: Date;

  @Expose()
  approvedBy?: string;

  @Expose()
  rejectedAt?: Date;

  @Expose()
  rejectionReason?: string;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  @Expose()
  isRequesting(): Boolean {
    return this.status === UsingStatus.requesting;
  }

  @Expose()
  isUsing(): Boolean {
    return this.status === UsingStatus.using;
  }

  @Expose()
  isReturning(): Boolean {
    return this.status === UsingStatus.returning;
  }

  @Expose()
  canApprove(): Boolean {
    return this.isRequesting() && this.approvedAt === null;
  }

  @Expose()
  canReject(): Boolean {
    return this.isRequesting() && this.approvedAt === null;
  }

  @Expose()
  canRequestReturn(): Boolean {
    return this.isUsing();
  }

  @Expose()
  canConfirmReturn(): Boolean {
    return this.isReturning();
  }

  @Expose()
  user: UserEntity;
}
