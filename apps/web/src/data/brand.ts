import { CreateBrandForm } from '@/components/Pages/Admin/Brands/Components/schema';
import { useFetchPagination } from '@/hooks/useFetchPagination';
import { env } from '@/libs/constant';
import { fetcher } from '@/libs/fetcher';

export type IBrand = {
  id: number;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

class BrandsService {
  public baseUrl = `${env?.basePath}/api/brands`;

  public createBrand(params: CreateBrandForm) {
    return fetcher(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public updateBrand(brandId: number, params: CreateBrandForm) {
    return fetcher(`${this.baseUrl}/${brandId}`, {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
  }

  public deleteBrand(brandId: number) {
    return fetcher(`${this.baseUrl}/${brandId}`, {
      method: 'DELETE',
    });
  }
}

export const brandsService = new BrandsService();

export const useFetchBrands = () => {
  return useFetchPagination<IBrand>({
    endpoint: brandsService.baseUrl,
  });
};
