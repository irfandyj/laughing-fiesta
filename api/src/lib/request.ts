import { Filter } from 'mongodb';

export enum SORT_ORDER {
  ASC = 'ASC',
  DESC = 'DESC'
}
export type SortQuery = [string, SORT_ORDER];

export interface Query<Doc> {
  limit: number;
  page: number;
  sortBy: SortQuery;
  filter: Filter<Doc>;
}