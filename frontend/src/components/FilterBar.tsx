'use client';
import { FilterState } from '@/lib/types';

interface Props {
  filters: FilterState;
  filterOptions: {
    categories: string[];
    regions: string[];
    statuses: string[];
    customerSegments: string[];
    salesChannels: string[];
    paymentMethods: string[];
  };
  onChange: (f: Partial<FilterState>) => void;
  onReset: () => void;
}

export default function FilterBar({ filters, filterOptions, onChange, onReset }: Props) {
  const selectClass = "bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const inputClass = "bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "text-xs text-gray-400 uppercase tracking-wider";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>From</label>
          <input type="date" value={filters.startDate} onChange={e => onChange({ startDate: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>To</label>
          <input type="date" value={filters.endDate} onChange={e => onChange({ endDate: e.target.value })} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Category</label>
          <select value={filters.category} onChange={e => onChange({ category: e.target.value })} className={selectClass}>
            <option value="all">All Categories</option>
            {filterOptions.categories.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Region</label>
          <select value={filters.region} onChange={e => onChange({ region: e.target.value })} className={selectClass}>
            <option value="all">All Regions</option>
            {filterOptions.regions.map(r => <option key={r} value={r} className="bg-gray-900">{r}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Order Status</label>
          <select value={filters.status} onChange={e => onChange({ status: e.target.value })} className={selectClass}>
            <option value="all">All Statuses</option>
            {filterOptions.statuses.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Customer Segment</label>
          <select value={filters.customerSegment} onChange={e => onChange({ customerSegment: e.target.value })} className={selectClass}>
            <option value="all">All Segments</option>
            {filterOptions.customerSegments.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Sales Channel</label>
          <select value={filters.salesChannel} onChange={e => onChange({ salesChannel: e.target.value })} className={selectClass}>
            <option value="all">All Channels</option>
            {filterOptions.salesChannels.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Payment Method</label>
          <select value={filters.paymentMethod} onChange={e => onChange({ paymentMethod: e.target.value })} className={selectClass}>
            <option value="all">All Methods</option>
            {filterOptions.paymentMethods.map(p => <option key={p} value={p} className="bg-gray-900">{p}</option>)}
          </select>
        </div>
        <button onClick={onReset} className="px-4 py-2 text-sm border border-white/20 rounded-lg text-gray-300 hover:bg-white/10 transition-colors">
          Reset Filters
        </button>
      </div>
    </div>
  );
}