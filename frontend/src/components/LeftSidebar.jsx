import React from 'react';
import { Layers, Search } from 'lucide-react';
import { SECTORS } from '../data/sectors';
import { SectorCard } from './SectorCard';
import { motion } from 'framer-motion';

export default function LeftSidebar({ selectedTicker, onSelectTicker, searchQuery, onSearchChange }) {
  const filteredSectors = SECTORS.map(sector => ({
    ...sector,
    companies: sector.companies.filter(
      company =>
        company.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(sector => sector.companies.length > 0);

  return (
    <aside className="w-full lg:w-[405px] xl:w-[430px] bg-[#0B0F14]/95 border-r border-border/70 flex flex-col h-auto lg:h-[calc(100vh-76px)] overflow-hidden">
      <div className="p-5 border-b border-border/50 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-accent-neon">Ecosystem Tracker</p>
            <h2 className="text-lg font-semibold text-text-primary mt-1">Supply Chain Watchlist</h2>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-accent-neon/10 border border-accent-neon/30 flex items-center justify-center shadow-glow">
            <Layers size={18} className="text-accent-neon" />
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-3 bg-bg-card/80 border border-border/70 rounded-2xl text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-neon/60 focus:shadow-glow transition-all"
          />
        </div>
      </div>

      <motion.div
        className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredSectors.length > 0 ? (
          filteredSectors.map(sector => (
            <SectorCard
              key={sector.id}
              sector={sector}
              selectedTicker={selectedTicker}
              onSelectTicker={onSelectTicker}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-center">
            <p className="text-sm text-text-secondary">No companies found</p>
          </div>
        )}
      </motion.div>

      <div className="p-5 border-t border-border/50 space-y-2 text-xs bg-white/[0.02]">
        <div className="flex justify-between">
          <span className="text-text-secondary">Total Companies</span>
          <span className="text-accent-neon font-semibold">
            {SECTORS.reduce((sum, s) => sum + s.companies.length, 0)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-secondary">Sectors</span>
          <span className="text-accent-neon font-semibold">{SECTORS.length}</span>
        </div>
      </div>
    </aside>
  );
}
