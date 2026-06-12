'use client';
import { useState, useEffect, useCallback } from 'react';
import { FilterState } from '@/lib/types';
import { fetchTransactions, Transaction, PaginationInfo } from '@/lib/api';

const STATUS_COLORS: Record<string, string> = {
  Completed: 'bg-green-500/20 text-green-400',
  Pending: 'bg-yellow-500/20 text-yellow-400',
  Cancelled: 'bg-red-500/20 text-red-400',
  Refunded: 'bg-blue-500/20 text-blue-400',
};

const COLUMNS = [
  { key: 'transaction_id', label: 'Transaction ID', sortable: true },
  { key: 'customer_name', label: 'Customer', sortable: true },
  { key: 'customer_segment', label: 'Segment', sortable: true },
  { key: 'product_name', label: 'Product', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'region', label: 'Region', sortable: true },
  { key: 'sales_channel', label: 'Channel', sortable: true },
  { key: 'payment_method', label: 'Payment', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'tax', label: 'Tax', sortable: true },
  { key: 'discount', label: 'Discount', sortable: true },
  { key: 'shipping', label: 'Shipping', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'transaction_date', label: 'Date', sortable: true },
];

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {COLUMNS.map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-white/10 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

interface Props {
  filters: FilterState;
  onFilterChange: (f: Partial<FilterState>) => void;
}

export default function TransactionsTable({ filters, onFilterChange }: Props) {
  const [data, setData] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchTransactions({
        startDate: filters.startDate,
        endDate: filters.endDate,
        category: filters.category !== 'all' ? filters.category : undefined,
        region: filters.region !== 'all' ? filters.region : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        customerSegment: filters.customerSegment !== 'all' ? filters.customerSegment : undefined,
        salesChannel: filters.salesChannel !== 'all' ? filters.salesChannel : undefined,
        paymentMethod: filters.paymentMethod !== 'all' ? filters.paymentMethod : undefined,
        search: filters.search,
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setData(result.data);
      setPagination(result.pagination);
    } catch {
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      onFilterChange({ search: searchInput, page: 1 });
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSort = (key: string) => {
    if (filters.sortBy === key) {
      onFilterChange({ sortOrder: filters.sortOrder === 'ASC' ? 'DESC' : 'ASC' });
    } else {
      onFilterChange({ sortBy: key, sortOrder: 'DESC' });
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (filters.sortBy !== col) return <span className="text-gray-600 ml-1">{"↕"}</span>;
    return <span className="text-indigo-400 ml-1">{filters.sortOrder === 'ASC' ? '↑' : '↓'}</span>;
  };

  const fmt = (v: string) => parseFloat(v).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{"Transactions"}</h3>
        <input
          type="text"
          placeholder="Search by ID, customer, or product..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm">
          {"⚠️"} {error}
          <button onClick={load} className="ml-3 underline">{"Retry"}</button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                >
                  {col.label}
                  {col.sortable && <SortIcon col={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
              : data.length === 0
              ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-16 text-center text-gray-500">
                    <div className="text-4xl mb-2">{"🔍"}</div>
                    <p>{"No transactions found matching your filters."}</p>
                  </td>
                </tr>
              )
              : data.map(tx => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-indigo-400 text-xs">{tx.transaction_id}</td>
                  <td className="px-4 py-3 text-gray-200">{tx.customer_name}</td>
                  <td className="px-4 py-3 text-gray-400">{tx.customer_segment}</td>
                  <td className="px-4 py-3 text-gray-300 max-w-[150px] truncate">{tx.product_name}</td>
                  <td className="px-4 py-3 text-gray-400">{tx.category}</td>
                  <td className="px-4 py-3 text-gray-400">{tx.region}</td>
                  <td className="px-4 py-3 text-gray-400">{tx.sales_channel}</td>
                  <td className="px-4 py-3 text-gray-400">{tx.payment_method}</td>
                  <td className="px-4 py-3 text-white font-medium">{"₹"}{fmt(tx.amount)}</td>
                  <td className="px-4 py-3 text-yellow-400">{"₹"}{fmt(tx.tax)}</td>
                  <td className="px-4 py-3 text-green-400">{"₹"}{fmt(tx.discount)}</td>
                  <td className="px-4 py-3 text-blue-400">{"₹"}{fmt(tx.shipping)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[tx.status] || ''}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(tx.transaction_date).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {pagination && !loading && data.length > 0 && (
        <div className="p-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3 text-sm">
          <span className="text-gray-400">
            {"Showing"} {((pagination.page - 1) * pagination.limit) + 1}{"–"}
            {Math.min(pagination.page * pagination.limit, pagination.total)} {"of"} {pagination.total.toLocaleString()} {"records"}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => {
                const newPage = pagination.page - 1;
                onFilterChange({ page: newPage });
              }}
              className="px-3 py-1 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {"← Prev"}
            </button>
            <span className="text-gray-300 px-2">
              {"Page"} {pagination.page} {"of"} {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => {
                const newPage = pagination.page + 1;
                onFilterChange({ page: newPage });
              }}
              className="px-3 py-1 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {"Next →"}
            </button>
          </div>
          <select
            value={filters.limit}
            onChange={e => onFilterChange({ limit: parseInt(e.target.value), page: 1 })}
            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-gray-300 text-sm"
          >
            {[10, 20, 50, 100].map(n => (
              <option key={n} value={n} className="bg-gray-900">{n} {"per page"}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}