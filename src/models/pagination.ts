export type Pagination<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  nextPage: number | null;
  prevPage: number | null;
};
