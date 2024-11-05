import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/libs/shared/services/prisma.service';
import { UsingStatus, BorrowRequest, Prisma } from '@prisma/client';
import { offsetPaginate, PaginatedResult } from '@/libs/utils/pagination';
import { OrderDirection } from '@/libs/commons/enum';
import { GetBorrowsQueryDto } from '@/borrows/dtos/borrow.dto';
import { BorrowStatus } from '@/libs/commons/enums/borrow';

@Injectable()
export class BorrowRequestService {
  constructor(private prisma: PrismaService) {}

  private getQueryFromBorrowStatus(borrowStatus: BorrowStatus) {
    switch (borrowStatus) {
      case BorrowStatus.borrowing:
        return {
          status: UsingStatus.using,
        };
      case BorrowStatus.returnConfirm:
        return {
          status: UsingStatus.returning,
        };
      case BorrowStatus.requesting:
        return {
          status: UsingStatus.requesting,
        };
      case BorrowStatus.returned:
        return {
          status: null,
          NOT: {
            returnedAt: null,
          },
        };
      case BorrowStatus.rejected:
        return {
          status: null,
          NOT: {
            rejectedAt: null,
          },
        };
      default:
        return {};
    }
  }

  async getList(
    query: GetBorrowsQueryDto,
    userId?: string,
  ): Promise<PaginatedResult<BorrowRequest>> {
    const { keyword, status, sortField, sortOrder = OrderDirection.DESC, ...rest } = query;
    let where: Prisma.BorrowRequestWhereInput = {};
    let orderBy: Prisma.BorrowRequestOrderByWithRelationInput = {
      createdAt: OrderDirection.DESC,
    };

    if (userId) {
      where.userId = userId;
    }

    if (keyword) {
      where.device = {
        is: {
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      };
    }

    if (sortField) {
      orderBy = {
        [sortField]: sortOrder,
      };
    }

    if (status) {
      where = {
        ...where,
        ...this.getQueryFromBorrowStatus(status),
      };
    }

    return offsetPaginate(this.prisma.borrowRequest, {
      where,
      include: {
        device: {
          include: {
            category: true,
          },
        },
        user: true,
      },
      orderBy: orderBy,
      ...rest,
    });
  }
}
