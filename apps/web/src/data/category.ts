import { CreateCategoryForm } from '@/components/Pages/Admin/Categories/Components/schema';
import { useFetchList } from '@/hooks/useFetchList';
import { useFetchPagination } from '@/hooks/useFetchPagination';
import { env } from '@/libs/constant';
import { fetcher } from '@/libs/fetcher';

export type ICategory = {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
};

export type GetUserInfoReq = {
  userId: string;
};

class CategoryService {
  public baseUrl = `${env?.basePath}/api/categories`;

  public createCategory(params: CreateCategoryForm) {
    return fetcher(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public updateCategory(brandId: number, params: CreateCategoryForm) {
    return fetcher(`${this.baseUrl}/${brandId}`, {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
  }

  public deleteCategory(brandId: number) {
    return fetcher(`${this.baseUrl}/${brandId}`, {
      method: 'DELETE',
    });
  }
}

export const categoryService = new CategoryService();

export const useFetchAllCategories = () => {
  return useFetchList<ICategory>({
    endpoint: `${categoryService.baseUrl}/all`,
  });
};

export const useFetchCategories = () => {
  return useFetchPagination<ICategory>({
    endpoint: categoryService.baseUrl,
  });
};
