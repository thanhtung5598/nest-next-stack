export interface CursorPaginateQuery {
  lastEndCursor?: number | string;
  pageSize?: number;
}

export interface CursorPaginate {
  endCursor: number;
  pageSize: number;
  hasMore: boolean;
  total: number;
  totalPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: CursorPaginate;
}

export type PaginateFunction = <T, K>(
  model: any,
  args?: CursorPaginateQuery & K,
) => Promise<PaginatedResult<T>>;

export const cursorPaginate: PaginateFunction = async (model, args: any = { where: undefined }) => {
  const { lastEndCursor, pageSize = 10, ...rest } = args;

  const [total, data] = await Promise.all([
    model.count({ where: args.where }),
    model.findMany({
      ...rest,
      take: pageSize + 1,
      ...(lastEndCursor && { cursor: { id: lastEndCursor } }),
      skip: lastEndCursor ? 1 : 0,
    }),
  ]);

  const totalPage = Math.ceil(total / pageSize);
  const hasMore = data.length > pageSize;
  if (hasMore) {
    data.pop();
  }

  return {
    data,
    pagination: {
      endCursor: data.length > 0 ? data[data.length - 1].id : null,
      total,
      hasMore,
      pageSize,
      totalPage,
    },
  };
};
