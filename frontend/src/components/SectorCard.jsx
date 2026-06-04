import React, { useState } from 'react';
import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMarketCap } from '../data/sectors';

export function SectorCard({ sector, selectedTicker, onSelectTicker }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="rounded-2xl border border-border/60 bg-bg-card/45 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.22)] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/[0.025] hover:bg-white/[0.045] transition-all group"
      >
        <div className="flex-1 text-left">
          <h3 className="text-sm font-semibold text-text-primary tracking-wide">{sector.name}</h3>
          <p className="text-[11px] text-text-secondary mt-0.5">{sector.companies.length} linked equities</p>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-accent-neon" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              {sector.companies.map(company => (
                <CompanyCardSmall
                  key={company.ticker}
                  company={company}
                  isSelected={selectedTicker === company.ticker}
                  onSelect={() => onSelectTicker(company.ticker)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CompanyCardSmall({ company, isSelected, onSelect }) {
  const isPositive = company.change >= 0;

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full p-4 rounded-2xl border transition-all text-left group ${
        isSelected
          ? 'bg-accent-neon/[0.09] border-accent-neon/60 shadow-[0_0_28px_rgba(140,255,63,0.14)]'
          : 'bg-[#111827]/80 border-border/50 hover:bg-[#151f2e] hover:border-accent-neon/35 hover:shadow-[0_0_24px_rgba(140,255,63,0.08)]'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className={`text-lg font-black tracking-wide ${isSelected ? 'text-accent-neon' : 'text-text-primary'}`}>
            {company.ticker}
          </p>
          <p className="text-xs text-text-secondary mt-0.5 truncate">
            {company.name}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-bold text-text-primary">${company.price.toFixed(2)}</p>
          <p className={`flex items-center justify-end gap-1 text-xs font-semibold mt-1 ${isPositive ? 'text-positive' : 'text-negative'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isPositive ? '+' : ''}{company.change.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/45">
        <MiniMetric label="P/E" value={company.pe.toFixed(1)} />
        <MiniMetric label="Market Cap" value={formatMarketCap(company.marketCap)} />
        <MiniMetric label="Avg Cost" value={`$${company.avgCost.toFixed(2)}`} />
      </div>
    </motion.button>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] uppercase tracking-[0.16em] text-text-secondary">{label}</p>
      <p className="text-[11px] font-semibold text-text-primary mt-1 truncate">{value}</p>
    </div>
  );
}
