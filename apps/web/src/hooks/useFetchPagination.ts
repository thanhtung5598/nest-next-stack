import { fetcher } from '@/libs/fetcher';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export type IPagination = {
  currentPage: number;
  hasMore: boolean;
  pageSize: number;
  totalPage: number;
};

type FetcherRes<T> = {
  data: T[];
  pagination: IPagination;
};

type UseFetchPaginationProps = {
  endpoint: string;
  options?: IPagination;
};

export function useFetchPagination<T>(props: UseFetchPaginationProps) {
  const { endpoint, options } = props;

  const router = useRouter();
  const pathname = usePathname();
  const initParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [extraQuery, setExtraQuery] = useState<Record<string, any>>();
  const [data, setData] = useState<T[]>();
  const [pagination, setPagination] = useState<IPagination>({
    currentPage: Number(initParams.get('page')) || 1,
    hasMore: true,
    pageSize: Number(initParams.get('pageSize')) || 10,
    totalPage: 1,
    ...options,
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const { currentPage, pageSize, hasMore, totalPage } = pagination;

  const searchParams = {
    page: currentPage.toString(),
    pageSize: pageSize.toString(),
    ...(extraQuery ? { ...extraQuery } : {}),
  };

  const nextPage = () => {
    if (hasMore && currentPage < totalPage) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage + 1,
      }));
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setPagination((prev) => ({
        ...prev,
        currentPage: prev.currentPage - 1,
      }));
    }
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPage) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  const refresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const onSetExtraQuery = (query: Record<string, any>) => {
    setExtraQuery(query);
  };

  useEffect(() => {
    router.replace(`${pathname}?${new URLSearchParams(searchParams).toString()}`);
  }, [searchParams]);

  useEffect(() => {
    if (fetcher) {
      setIsLoading(true);

      fetcher<FetcherRes<T>>(`${endpoint}?${new URLSearchParams(searchParams).toString()}`)
        .then((res) => {
          setData(res.data);
          setPagination(res.pagination);
          router.replace(`${pathname}?${new URLSearchParams(searchParams).toString()}`);
        })
        .finally(() => setIsLoading(false));
    }
  }, [searchParams.page, refreshKey]);

  return { isLoading, data, pagination, nextPage, previousPage, setPage, onSetExtraQuery, refresh };
}
