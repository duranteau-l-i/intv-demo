export enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type PaginationOptions = {
  orderBy?: OrderBy;
  orderValue?: string;
  perPage?: number;
  page?: number;
};

export type PaginationResponse<T> = {
  data: T[];
  count: number;
  pages: number;
  orderBy: OrderBy;
  orderValue: string;
  perPage: number;
  page: number;
};

export const pagination = (options: PaginationOptions, count = 0) => {
  const { perPage, orderBy, orderValue, page } = paginationValues(options);

  const pages = Math.ceil(count / perPage);

  return {
    orderBy,
    orderValue,
    perPage,
    page,
    pages,
  };
};

export const paginationValues = (options: PaginationOptions) => {
  const orderBy = options?.orderBy ? options.orderBy : OrderBy.ASC;
  const perPage = options?.perPage ? Number(options.perPage) : 10;
  const page = options?.page
    ? (options.page - 1) * (options?.perPage ? Number(options.perPage) : 10)
    : 0 * (options?.perPage ? Number(options.perPage) : 10);

  return { perPage, orderBy, orderValue: options.orderValue, page };
};
