import { useFetchPagination } from '@/hooks/useFetchPagination';
import { useFetch } from '@/hooks/useFetch';
import { env } from '@/libs/constant';
import { fetcher } from '@/libs/fetcher';
import { IDepartment } from './department';
import { ICategory } from './category';
import { CreateUserForm, UpdateUserForm } from '@/components/Pages/Admin/Users/Components/schema';
import { IDevice } from './device';
import { IBorrowRequest } from './borrow';

type UserRole = 'admin' | 'employee';

export type IUserProfile = {
  id: string;
  name: string;
  devicesCount: number;
  borrowDeviceCount: number;
  borrowHistoryCount: number;
  department: IDepartment;
  avatarUrl: string;
  email: string;
  isActive: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type IUserDevice = {
  id: number;
  sku: string;
  name: string;
  category: ICategory;
  note: string;
};

export type IUserBorrowDevice = {
  id: number;
  status: 'returning' | 'using';
  borrowedAt: string;
  returnedAt: string;
  device: {
    id: number;
    sku: string;
    name: string;
    category: ICategory;
    note: null;
  };
};

export type GetUserInfoReq = {
  userId: string;
};

class UserService {
  public baseUrl = `${env?.basePath}/api/users`;

  public getMe() {
    return fetcher<IUserProfile>(`${this.baseUrl}/me`);
  }

  public createUser(params: CreateUserForm) {
    return fetcher(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public updateUser(userId: string, params: UpdateUserForm) {
    return fetcher(`${this.baseUrl}/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
  }
}

export const userService = new UserService();

export const useMe = () => {
  return useFetch<IUserProfile>({
    endpoint: `${userService.baseUrl}/me`,
  });
};

export const useFetchUserById = ({ userId }: { userId: string }) => {
  return useFetch<IUserProfile>({
    endpoint: `${userService.baseUrl}/${userId}`,
  });
};

export const useFetchUsers = () => {
  return useFetchPagination<IUserProfile>({
    endpoint: userService.baseUrl,
  });
};

export const useFetchUserDevices = () => {
  return useFetchPagination<IUserDevice>({
    endpoint: `${userService.baseUrl}/devices`,
  });
};

export const useFetchUserBorrowDevices = () => {
  return useFetchPagination<IUserBorrowDevice>({
    endpoint: `${userService.baseUrl}/borrow_devices`,
  });
};

export const useFetchUserDevicesById = ({ userId }: { userId: string }) => {
  return useFetchPagination<IUserDevice>({
    endpoint: `${userService.baseUrl}/${userId}/devices`,
  });
};

export const useFetchBorrowHistory = () => {
  return useFetchPagination<IBorrowRequest>({
    endpoint: `${userService.baseUrl}/borrow_history`,
  });
};
