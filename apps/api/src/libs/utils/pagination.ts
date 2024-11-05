export interface PaginateBaseParams {
  page?: number;
  pageSize?: number;
}

export interface PaginateBaseResult {
  total: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  totalPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginateBaseResult;
}

export type PaginateFunction = <T, K>(
  model: any,
  args?: PaginateBaseParams & K,
) => Promise<PaginatedResult<T>>;

export const offsetPaginate: PaginateFunction = async (model, args: any = { where: undefined }) => {
  const { page = 1, pageSize = 10, ...rest } = args;

  const skip = page > 0 ? pageSize * (page - 1) : 0;

  const [total, data] = await Promise.all([
    model.count({ where: args.where }),
    model.findMany({
      ...rest,
      take: pageSize,
      skip,
    }),
  ]);

  const totalPage = Math.ceil(total / pageSize);

  return {
    data,
    pagination: {
      total,
      currentPage: page,
      hasMore: page * pageSize < total,
      pageSize: pageSize,
      totalPage,
    },
  };
};
