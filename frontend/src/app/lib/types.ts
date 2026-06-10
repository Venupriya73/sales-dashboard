export type SortOrder = 'ASC' | 'DESC';

export interface FilterState {
  startDate: string;
  endDate: string;
  category: string;
  region: string;
  search: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: SortOrder;
}

export const defaultFilters: FilterState = {
  startDate: '',
  endDate: '',
  category: 'all',
  region: 'all',
  search: '',
  page: 1,
  limit: 20,
  sortBy: 'transaction_date',
  sortOrder: 'DESC',
};