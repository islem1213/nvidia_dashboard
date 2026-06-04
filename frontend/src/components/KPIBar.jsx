import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { useKPI } from '../hooks/useMarket';

export default function KPIBar() {
  const { kpi, isLoading } = useKPI();

  if (isLoading && !kpi) {
    return <div className="w-full h-20 bg-card border-b border-gray-800 shimmer-bg" />;
  }

  // Fallback for mock/empty data
  const data = kpi || {
    nvda_price: 0,
    nvda_change: 0,
    total_market_cap: 0,
    reporting_this_week: 0,
    average_performance: 0,
    stale: false
  };

  const formatCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    return `$${cap}`;
  };

  return (
    <div className="w-full bg-card border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-8 overflow-x-auto whitespace-nowrap hide-scrollbar">
        
        <div className="flex flex-col">
          <div className="text-muted text-[11px] uppercase tracking-wide flex items-center gap-1.5 mb-1">
            <Activity size={14} className="text-accent" />
            NVIDIA (NVDA)
            {data.stale && <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse ml-2" title="Stale Data (Cache Fallback)" />}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-white text-[28px] font-bold">
              ${data.nvda_price ? data.nvda_price.toFixed(2) : '0.00'}
            </span>
            <span className={`flex items-center text-[13px] font-medium ${data.nvda_change >= 0 ? 'text-positive' : 'text-negative'}`}>
              {data.nvda_change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
              {Math.abs(data.nvda_change || 0).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="h-10 w-px bg-gray-800 mx-4" />

        <div className="flex flex-col">
          <div className="text-muted text-[11px] uppercase tracking-wide flex items-center gap-1.5 mb-1">
            <DollarSign size={14} /> Ecosystem Market Cap
          </div>
          <div className="text-white text-[28px] font-bold">
            {formatCap(data.total_market_cap)}
          </div>
        </div>

        <div className="h-10 w-px bg-gray-800 mx-4" />

        <div className="flex flex-col">
          <div className="text-muted text-[11px] uppercase tracking-wide flex items-center gap-1.5 mb-1">
            <TrendingUp size={14} /> Avg Daily Performance
          </div>
          <div className={`text-[28px] font-bold flex items-baseline gap-1 ${data.average_performance >= 0 ? 'text-positive' : 'text-negative'}`}>
            {data.average_performance >= 0 ? '+' : ''}{data.average_performance.toFixed(2)}%
          </div>
        </div>

        <div className="h-10 w-px bg-gray-800 mx-4 hidden md:block" />

        <div className="flex flex-col hidden md:flex">
          <div className="text-muted text-[11px] uppercase tracking-wide flex items-center gap-1.5 mb-1">
            <Calendar size={14} /> Earnings This Week
          </div>
          <div className="text-white text-[28px] font-bold">
            {data.reporting_this_week}
          </div>
        </div>

      </div>
    </div>
  );
}
