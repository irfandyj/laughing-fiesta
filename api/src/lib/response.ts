interface GetMeta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: string[][];
  limit: number;
  search?: string;
  filter?: {
    age: string;
  };
}

interface GetLinks {
  first: string;
  previous: string;
  current: string;
  next: string;
  last: string;
}

/**
 * Reference to https://www.npmjs.com/package/nestjs-paginate
 */
export interface GetResponse<T> {
  data: T[];
  meta: GetMeta;
  links: GetLinks;
}
