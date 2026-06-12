'use client';
import { useState, useEffect, useCallback } from 'react';
import { FilterState, defaultFilters } from '@/lib/types';
import { fetchSummary, fetchCharts, fetchFilterOptions, getExportUrl } from '@/lib/api';
import SummaryCards from '@/components/SummaryCards';
import FilterBar from '@/components/FilterBar';
import ChartsSection from '@/components/ChartsSection';
import TransactionsTable from '@/components/TransactionsTable';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [summary, setSummary] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState({
    categories: [], regions: [], statuses: [],
    customerSegments: [], salesChannels: [], paymentMethods: []
  });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [error, setError] = useState('');

  const activeFilters = {
    startDate: filters.startDate,
    endDate: filters.endDate,
    category: filters.category !== 'all' ? filters.category : undefined,
    region: filters.region !== 'all' ? filters.region : undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    customerSegment: filters.customerSegment !== 'all' ? filters.customerSegment : undefined,
    salesChannel: filters.salesChannel !== 'all' ? filters.salesChannel : undefined,
    paymentMethod: filters.paymentMethod !== 'all' ? filters.paymentMethod : undefined,
    search: filters.search,
  };

  useEffect(() => {
    fetchFilterOptions().then(setFilterOptions).catch(console.error);
  }, []);

  const loadTopData = useCallback(async () => {
    setSummaryLoading(true);
    setChartsLoading(true);
    setError('');
    try {
      const [s, c] = await Promise.all([
        fetchSummary(activeFilters),
        fetchCharts(activeFilters),
      ]);
      setSummary(s);
      setCharts(c);
    } catch {
      setError('Failed to load dashboard data. Please check your backend connection.');
    } finally {
      setSummaryLoading(false);
      setChartsLoading(false);
    }
  }, [filters.startDate, filters.endDate, filters.category, filters.region,
      filters.status, filters.customerSegment, filters.salesChannel, filters.paymentMethod, filters.search]);

  useEffect(() => { loadTopData(); }, [loadTopData]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => setFilters(defaultFilters);

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-[#0f1117] text-white">
        <header className="border-b border-white/10 bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{"Sales Analytics"}</h1>
              <p className="text-sm text-gray-400">{"Real-time insights from 10,000+ transactions"}</p>
            </div>
            <button
              onClick={() => window.open(getExportUrl(activeFilters), '_blank')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {"Export CSV"}
            </button>
          </div>
        </header>
        <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}
          <FilterBar filters={filters} filterOptions={filterOptions} onChange={handleFilterChange} onReset={handleReset} />
          <SummaryCards summary={summary} loading={summaryLoading} />
          <ChartsSection charts={charts} loading={chartsLoading} />
          <TransactionsTable filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </main>
    </ErrorBoundary>
  );
}