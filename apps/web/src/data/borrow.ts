import { useFetchPagination } from '@/hooks/useFetchPagination';
import { env } from '@/libs/constant';
import { IDevice } from './device';
import { IUserProfile } from './user';
import { fetcher } from '@/libs/fetcher';

export enum BorrowStatus {
  requesting = 'requesting',
  rejected = 'rejected',
  borrowing = 'borrowing',
  returnConfirm = 'return_confirm',
  returned = 'returned',
}

export type IBorrowRequest = {
  id: number;
  device: IDevice;
  user: IUserProfile;
  note: string;
  rejectionReason: string;
  borrowedAt: string;
  returnedAt: string;
  approvedAt: string;
  rejectedAt: string;
  createdAt: string;
  updatedAt: string;
  status: BorrowStatus;
};

type CreateBorrowReq = {
  deviceId: number;
  note?: string;
  borrowedAt: string;
};

class BorrowService {
  public baseUrl = `${env?.basePath}/api/borrows`;

  public createBorrow(body: CreateBorrowReq) {
    return fetcher(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public borrowAction(
    borrowRequestId: number,
    actionType: 'approve' | 'reject' | 'confirmReturn' | 'requestReturn',
    data?: { rejectionReason?: string },
  ): Promise<IBorrowRequest> {
    return fetcher(`${this.baseUrl}/${borrowRequestId}/process`, {
      method: 'PATCH',
      body: JSON.stringify({
        type: actionType,
        data,
      }),
    });
  }
}

export const borrowService = new BorrowService();

export const useFetchBorrowRequest = () => {
  return useFetchPagination<IBorrowRequest>({
    endpoint: borrowService.baseUrl,
  });
};
