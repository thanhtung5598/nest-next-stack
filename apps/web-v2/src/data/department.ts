import { CreateDepartmentForm } from '@/components/Pages/Admin/Departments/Components/schema';
import { useFetchList } from '@/hooks/useFetchList';
import { useFetchPagination } from '@/hooks/useFetchPagination';
import { env } from '@/libs/constant';
import { fetcher } from '@/libs/fetcher';

export type IDepartment = {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type GetUserInfoReq = {
  userId: string;
};

class DepartmentService {
  public baseUrl = `${env?.basePath}/api/departments`;

  public createDepartment(params: CreateDepartmentForm) {
    return fetcher(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public updateDepartment(departmentId: number, params: CreateDepartmentForm) {
    return fetcher(`${this.baseUrl}/${departmentId}`, {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
  }

  public deleteDepartment(departmentId: number) {
    return fetcher(`${this.baseUrl}/${departmentId}`, {
      method: 'DELETE',
    });
  }
}

export const departmentService = new DepartmentService();

export const useFetchAllDepartments = () => {
  return useFetchList<IDepartment>({
    endpoint: `${departmentService.baseUrl}/all`,
  });
};

export const useFetchDepartments = () => {
  return useFetchPagination<IDepartment>({
    endpoint: departmentService.baseUrl,
  });
};
