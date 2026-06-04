import React, { useState, useMemo } from 'react';
import { Activity, AlertCircle, CandlestickChart, LineChart as LineChartIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { useCompanyDetails } from '../hooks/useMarket';
import PriceChart from './PriceChart';
import PerformanceChart from './PerformanceChart';
import { motion } from 'framer-motion';

export default function DetailPanel({ ticker }) {
  const [period, setPeriod] = useState('1D');
  const [chartMode, setChartMode] = useState('candle');
  const { details, isLoading } = useCompanyDetails(ticker, period);

  const priceStats = useMemo(() => {
    if (!details?.chart || details.chart.length === 0) return null;
    const closes = details.chart.map(d => d.close);
    const high = Math.max(...closes);
    const low = Math.min(...closes);
    const first = closes[0];
    const last = closes[closes.length - 1];
    const change = ((last - first) / first) * 100;
    return { high, low, change, first, last };
  }, [details?.chart]);

  return (
    <main className="w-full h-full bg-bg-base overflow-y-auto hide-scrollbar flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 px-5 lg:px-8 py-6 border-b border-border/50 bg-[#0B0F14]/88 backdrop-blur-xl"
      >
        <div className="flex items-end justify-between gap-5 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-accent-neon">Selected Equity</p>
            <h1 className="text-4xl font-black text-text-primary mt-1">{ticker}</h1>
            <p className="text-sm text-text-secondary mt-1">{details?.name}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-text-primary">
              ${priceStats?.last.toFixed(2) || '0.00'}
            </p>
            <p className={`text-lg font-semibold flex items-center justify-end gap-1 mt-1 ${priceStats?.change >= 0 ? 'text-positive' : 'text-negative'}`}>
              {priceStats?.change >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {Math.abs(priceStats?.change || 0).toFixed(2)}%
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 px-5 lg:px-8 py-6 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-32 shimmer-bg rounded-xl" />
            <div className="h-96 shimmer-bg rounded-xl" />
          </div>
        ) : details ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border border-accent-neon/35 bg-gradient-to-br from-accent-neon/[0.08] to-white/[0.02] backdrop-blur-xl shadow-glow"
            >
              <p className="text-xs font-semibold text-accent-neon uppercase tracking-[0.18em] mb-2">Role in NVIDIA Ecosystem</p>
              <p className="text-sm text-text-primary leading-relaxed max-w-4xl">{details.role}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <StatCard label="High" value={`$${priceStats?.high.toFixed(2)}`} trend="up" />
              <StatCard label="Low" value={`$${priceStats?.low.toFixed(2)}`} trend="down" />
              <StatCard label="Change" value={`${priceStats?.change.toFixed(2)}%`} trend={priceStats?.change >= 0 ? 'up' : 'down'} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-bg-card/55 border border-border/50 rounded-2xl p-4 lg:p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Activity size={16} className="text-accent-neon" />
                    TradingView Price Chart
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">Candles, SMA overlays, volume and crosshair tooltip</p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  {['1D', '5D', '1M', '3M', '1Y', '5Y'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        period === p
                          ? 'bg-accent-neon text-black'
                          : 'bg-bg-elevated/70 border border-border/50 text-text-secondary hover:border-accent-neon/50 hover:text-text-primary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <div className="flex rounded-xl border border-border/50 bg-bg-elevated/70 p-1">
                    {[
                      ['candle', CandlestickChart],
                      ['line', LineChartIcon],
                    ].map(([mode, Icon]) => (
                      <button
                        key={mode}
                        onClick={() => setChartMode(mode)}
                        title={mode === 'candle' ? 'Candle' : 'Line'}
                        aria-label={mode === 'candle' ? 'Candle chart' : 'Line chart'}
                        className={`h-8 w-9 rounded-lg flex items-center justify-center transition-all ${chartMode === mode ? 'bg-accent-neon text-black' : 'text-text-secondary hover:text-text-primary'}`}
                      >
                        <Icon size={15} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <PriceChart data={details.chart} mode={chartMode} />
              {(details.stale || details.fallback) && (
                <div className="flex items-center gap-2 text-yellow-500 text-xs mt-3">
                  <AlertCircle size={14} />
                  <span>{details.fallback ? 'Showing curated sample market data' : 'Showing cached data'}</span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-semibold text-text-primary mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <MetricCard 
                  label="Market Cap" 
                  value={formatCap(details.fundamentals?.market_cap)} 
                />
                <MetricCard 
                  label="P/E Ratio" 
                  value={details.fundamentals?.pe_ratio !== "N/A" ? parseFloat(details.fundamentals?.pe_ratio).toFixed(2) : "-"} 
                />
                <MetricCard 
                  label="Dividend Yield" 
                  value={details.fundamentals?.dividend_yield !== "N/A" ? (parseFloat(details.fundamentals?.dividend_yield) * 100).toFixed(2) + "%" : "-"} 
                />
                <MetricCard 
                  label="52W High" 
                  value={details.fundamentals?.fifty_two_week_high !== "N/A" ? "$" + parseFloat(details.fundamentals?.fifty_two_week_high).toFixed(2) : "-"} 
                />
                <MetricCard 
                  label="52W Low" 
                  value={details.fundamentals?.fifty_two_week_low !== "N/A" ? "$" + parseFloat(details.fundamentals?.fifty_two_week_low).toFixed(2) : "-"} 
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-semibold text-text-primary mb-3">Latest News</h3>
              <div className="space-y-2">
                {details.news && details.news.length > 0 ? (
                  details.news.slice(0, 5).map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-3 bg-bg-elevated/30 border border-border/30 rounded-lg hover:border-accent-neon/50 hover:bg-bg-elevated/60 transition-all"
                    >
                      <p className="text-xs font-medium text-text-primary group-hover:text-accent-neon transition-colors line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-text-secondary mt-1.5">
                        {item.source} • {formatTime(item.timestamp)}
                      </p>
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-text-secondary text-center py-4">No recent news</p>
                )}
              </div>
            </motion.div>

            <PerformanceChart tickerData={details.chart} selectedTicker={ticker} />
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-text-secondary">Failed to load details</p>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, trend }) {
  return (
    <div className="bg-bg-elevated/45 border border-border/45 rounded-2xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-2">{label}</p>
      <p className={`text-xl font-bold ${trend === 'up' ? 'text-positive' : 'text-negative'}`}>
        {value}
      </p>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-bg-elevated/30 border border-border/40 rounded-2xl p-3 hover:border-accent-neon/35 transition-colors">
      <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1.5">{label}</p>
      <p className="text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}

function formatCap(cap) {
  if (!cap || cap === "N/A") return "-";
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap}`;
}

function formatTime(ts) {
  if (!ts) return '';
  const date = new Date(ts * 1000);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
