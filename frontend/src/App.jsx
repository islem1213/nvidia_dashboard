import React, { useState, useMemo } from 'react';
import PremiumNavbar from './components/PremiumNavbar';
import LeftSidebar from './components/LeftSidebar';
import DetailPanel from './components/DetailPanel';
import { DEFAULT_SELECTED_TICKER } from './data/sectors';
import { motion } from 'framer-motion';

export default function App() {
  const [selectedTicker, setSelectedTicker] = useState(DEFAULT_SELECTED_TICKER);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock stats - in production, fetch from API
  const stats = useMemo(() => ({
    portfolioValue: 125430,
    ecosystemMarketCap: 2.5e12,
    avgPerformance: 2.45,
    earningsThisWeek: 3,
  }), []);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <PremiumNavbar stats={stats} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <LeftSidebar 
          selectedTicker={selectedTicker}
          onSelectTicker={setSelectedTicker}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <motion.div
          className="flex-1 overflow-hidden min-w-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTicker ? (
            <DetailPanel ticker={selectedTicker} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-text-secondary text-lg mb-2">Select a company to view details</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
