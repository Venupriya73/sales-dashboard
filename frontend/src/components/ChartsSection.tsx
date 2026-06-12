'use client';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

function ChartSkeleton() {
  return <div className="h-64 bg-white/5 rounded-xl animate-pulse" />;
}

export default function ChartsSection({ charts, loading }: { charts: any; loading: boolean }) {
  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map(i => <ChartSkeleton key={i} />)}
    </div>
  );
  if (!charts) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Revenue Trend */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          {"Revenue Trend"}
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={charts.revenueTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(v: number) => [formatCurrency(v), 'Revenue']}
            />
            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sales by Category */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          {"Sales by Category"}
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={charts.byCategory} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#9ca3af' }} width={100} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(v: number) => [formatCurrency(v), 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sales by Region */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          {"Sales by Region"}
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={charts.byRegion}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="region" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(v: number) => [formatCurrency(v), 'Revenue']}
            />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {charts.byRegion.map((_: any, i: number) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Status */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          {"Order Status"}
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={charts.byStatus.map((d: any) => ({ ...d, count: parseInt(d.count) }))}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {charts.byStatus.map((_: any, i: number) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(value: any, name: any) => [value, name]}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}