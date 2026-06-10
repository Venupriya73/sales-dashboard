interface Props {
  summary: any;
  loading: boolean;
}

const cards = [
  { key: 'total_revenue', label: 'Total Revenue', prefix: '₹', format: (v: string) => parseFloat(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
  { key: 'total_orders', label: 'Total Orders', prefix: '', format: (v: string) => parseInt(v).toLocaleString() },
  { key: 'avg_order_value', label: 'Avg Order Value', prefix: '₹', format: (v: string) => parseFloat(v).toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
  { key: 'total_customers', label: 'Total Customers', prefix: '', format: (v: string) => parseInt(v).toLocaleString() },
  { key: 'top_category', label: 'Top Category', prefix: '', format: (v: string) => v },
  { key: 'best_region', label: 'Best Region', prefix: '', format: (v: string) => v },
];

function SkeletonCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse">
      <div className="h-3 bg-white/10 rounded w-24 mb-3" />
      <div className="h-8 bg-white/10 rounded w-32" />
    </div>
  );
}

export default function SummaryCards({ summary, loading }: Props) {
  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map(card => (
        <div key={card.key} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{card.label}</p>
          <p className="text-xl font-bold text-white">
            {card.prefix}{summary ? card.format(summary[card.key]) : '—'}
          </p>
        </div>
      ))}
    </div>
  );
}