import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export interface Transaction {
  id: number;
  transaction_id: string;
  customer_name: string;
  product_name: string;
  category: string;
  region: string;
  amount: string;
  status: string;
  transaction_date: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionsResponse {
  data: Transaction[];
  pagination: PaginationInfo;
}

export interface Summary {
  total_revenue: string;
  total_orders: string;
  avg_order_value: string;
  total_customers: string;
  top_category: string;
  best_region: string;
}

export interface Filters {
  startDate?: string;
  endDate?: string;
  category?: string;
  region?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const fetchTransactions = async (filters: Filters): Promise<TransactionsResponse> => {
  const { data } = await api.get('/transactions', { params: filters });
  return data;
};

export const fetchSummary = async (filters: Filters): Promise<Summary> => {
  const { data } = await api.get('/transactions/summary', { params: filters });
  return data;
};

export const fetchCharts = async (filters: Filters) => {
  const { data } = await api.get('/transactions/charts', { params: filters });
  return data;
};

export const fetchFilterOptions = async () => {
  const { data } = await api.get('/transactions/filters');
  return data;
};

export const getExportUrl = (filters: Filters): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v && v !== 'all') params.append(k, String(v));
  });
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/transactions/export?${params.toString()}`;
};