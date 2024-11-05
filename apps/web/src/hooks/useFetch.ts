import { fetcher } from '@/libs/fetcher';
import { useEffect, useState } from 'react';

type UseFetchProps = {
  endpoint: string;
  init?: RequestInit;
};

export function useFetch<T>(props: UseFetchProps) {
  const { endpoint, init } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (fetcher) {
      setIsLoading(true);

      fetcher<T>(`${endpoint}`, init)
        .then((res) => {
          setData(res);
        })
        .finally(() => setIsLoading(false));
    }
  }, [refreshKey]);

  const refresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return { isLoading, data, refresh };
}
