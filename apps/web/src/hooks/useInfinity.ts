import { fetcher } from '@/libs/fetcher';
import { useCallback, useEffect, useState } from 'react';

type PaginationType = 'cursor' | 'offset';

type Props<T> = {
  endpoint: string;
  params: any;
  enabled?: boolean;
  nextCursor: (previous?: T, additionalParams?: any) => string | undefined;
  onSuccess?: (data: T) => void;
  paginationType?: PaginationType;
};

type UseInfinityReturn<T> = {
  data: T[];
  loading: boolean;
  next: (additionalParams?: any) => void;
  mutate: (mutateData: T[]) => void;
  refresh: () => void;
};

export function useInfinity<T = JSON>(props: Props<T>): UseInfinityReturn<T> {
  const {
    endpoint,
    params,
    enabled = true,
    nextCursor,
    onSuccess,
    paginationType = 'cursor',
  } = props;

  const [loading, setLoading] = useState(true);
  const [dataset, setDataset] = useState<T[]>([]);

  const onMutate = (mutateData: T[]) => {
    setDataset(mutateData);
  };

  const fetchNextPage = useCallback(
    async (additionalParams: any) => {
      if (loading) return;

      const cursor = nextCursor(dataset.at(-1), additionalParams);

      if (cursor) {
        setLoading(true);
        await fetcher<T>(
          `${endpoint}?${new URLSearchParams({ ...(params ?? {}), ...(paginationType === 'cursor' ? { lastEndCursor: cursor } : { offset: cursor }) }).toString()}`,
        )
          .then((res) => {
            setDataset(dataset.concat(res));
            onSuccess?.(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [dataset, endpoint, nextCursor, loading, onSuccess, paginationType, params],
  );

  const onRefresh = async () => {
    await fetcher<T>(`${endpoint}?${new URLSearchParams(params ?? {}).toString()}`)
      .then((res) => {
        setLoading(true);
        setDataset([res]);
        onSuccess?.(res);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const init = async () => {
      await fetcher<T>(`${endpoint}?${new URLSearchParams(params ?? {}).toString()}`)
        .then((res) => {
          setLoading(true);
          setDataset([res]);
          onSuccess?.(res);
        })
        .finally(() => setLoading(false));
    };
    if (enabled) init();
    // eslint-disable-next-line
  }, [JSON.stringify(params), enabled]);

  return {
    data: dataset,
    loading: loading,
    next: fetchNextPage,
    mutate: onMutate,
    refresh: onRefresh,
  };
}
