import { Filter } from 'mongodb';

export interface Query<Doc> {
  limit: number;
  page: number;
  sortBy: [string, 'ASC' | 'DESC'];
  filter: Filter<Doc>;
}