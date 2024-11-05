import { fetcher } from '@/libs/fetcher';
import { useEffect, useState } from 'react';

type UseFetchProps = {
  endpoint: string;
};

export function useFetchList<T>(props: UseFetchProps) {
  const { endpoint } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [extraQuery, setExtraQuery] = useState<Record<string, any>>();
  const [data, setData] = useState<T[]>();

  const onSetExtraQuery = (query: Record<string, any>) => {
    setExtraQuery(query);
  };

  useEffect(() => {
    if (fetcher) {
      setIsLoading(true);

      fetcher<T[]>(`${endpoint}?${new URLSearchParams(extraQuery).toString()}`)
        .then((res) => {
          setData(res);
        })
        .finally(() => setIsLoading(false));
    }
  }, [extraQuery]);

  return { isLoading, data, onSetExtraQuery };
}
