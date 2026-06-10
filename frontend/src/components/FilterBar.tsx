'use client';
import { FilterState } from '@/lib/types';

interface Props {
  filters: FilterState;
  filterOptions: { categories: string[]; regions: string[] };
  onChange: (f: Partial<FilterState>) => void;
  onReset: () => void;
}

export default function FilterBar({ filters, filterOptions, onChange, onReset }: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider">From</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={e => onChange({ startDate: e.target.value })}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider">To</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={e => onChange({ endDate: e.target.value })}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider">Category</label>
          <select
            value={filters.category}
            onChange={e => onChange({ category: e.target.value })}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {filterOptions.categories.map(c => (
              <option key={c} value={c} className="bg-gray-900">{c}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider">Region</label>
          <select
            value={filters.region}
            onChange={e => onChange({ region: e.target.value })}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Regions</option>
            {filterOptions.regions.map(r => (
              <option key={r} value={r} className="bg-gray-900">{r}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm border border-white/20 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}