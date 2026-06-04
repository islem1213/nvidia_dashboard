import React from 'react';
import { BarChart3, CalendarDays, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PremiumNavbar({ stats, searchQuery, onSearchChange }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[76px] bg-[#0B0F14]/92 border-b border-border/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 px-5 lg:px-7 sticky top-0 z-30"
    >
      <div className="flex items-center gap-4 min-w-fit">
        <div className="w-11 h-11 rounded-2xl bg-accent-neon/10 border border-accent-neon/50 flex items-center justify-center shadow-glow">
          <BarChart3 size={20} className="text-accent-neon" />
        </div>
        <div>
          <h1 className="text-base lg:text-lg font-bold text-text-primary">NVIDIA Ecosystem Tracker</h1>
          <p className="text-[11px] text-text-secondary">Institutional AI supply chain dashboard</p>
        </div>
      </div>

      <div className="hidden xl:flex items-center gap-1 rounded-2xl border border-border/50 bg-white/[0.025] p-1">
        {['Dashboard', 'News', 'Earnings'].map((item) => (
          <button key={item} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${item === 'Dashboard' ? 'bg-accent-neon text-black' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'}`}>
            {item}
          </button>
        ))}
      </div>

      <div className="hidden md:flex flex-1 max-w-sm relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search ticker, company, sector"
          className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-bg-card/80 border border-border/60 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent-neon/60 focus:shadow-glow transition-all"
        />
      </div>

      <div className="hidden lg:grid grid-cols-4 gap-3">
        <NavMetric label="Portfolio Value" value={`$${stats?.portfolioValue?.toLocaleString() || '0'}`} />
        <NavMetric label="Ecosystem Cap" value={`$${(stats?.ecosystemMarketCap / 1e12).toFixed(2)}T`} accent />
        <NavMetric label="Avg Daily" value={`+${stats?.avgPerformance?.toFixed(2)}%`} positive />
        <NavMetric label="Earnings Week" value={stats?.earningsThisWeek || 0} icon={<CalendarDays size={13} />} />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 bg-accent-neon/5 border border-accent-neon/30 rounded-2xl">
        <Sparkles size={14} className="text-accent-neon" />
        <span className="text-xs text-accent-neon font-semibold">Live</span>
      </div>
    </motion.nav>
  );
}

function NavMetric({ label, value, accent, positive, icon }) {
  return (
    <div className="min-w-[112px] rounded-2xl border border-border/45 bg-white/[0.025] px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-text-secondary flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className={`text-sm font-bold mt-1 ${accent ? 'text-accent-neon' : positive ? 'text-positive' : 'text-text-primary'}`}>
        {value}
      </p>
    </div>
  );
}
