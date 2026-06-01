import React, { useState } from 'react';
import KPIBar from './components/KPIBar';
import EcosystemGrid from './components/EcosystemGrid';
import DetailPanel from './components/DetailPanel';
import NewsFeed from './components/NewsFeed';
import EarningsCalendar from './components/EarningsCalendar';

export default function App() {
  const [activeTab, setActiveTab] = useState('grid');
  const [selectedTicker, setSelectedTicker] = useState(null);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      <KPIBar />
      
      {/* Navigation Tabs */}
      <div className="px-6 pt-6 border-b border-gray-800 flex gap-6 shrink-0">
        <button 
          onClick={() => {setActiveTab('grid'); setSelectedTicker(null);}}
          className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${activeTab === 'grid' ? 'border-accent text-white' : 'border-transparent text-text-2 hover:text-white'}`}
        >
          Ecosystem Grid
        </button>
        <button 
          onClick={() => {setActiveTab('news'); setSelectedTicker(null);}}
          className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${activeTab === 'news' ? 'border-accent text-white' : 'border-transparent text-text-2 hover:text-white'}`}
        >
          Global News Feed
        </button>
        <button 
          onClick={() => {setActiveTab('earnings'); setSelectedTicker(null);}}
          className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${activeTab === 'earnings' ? 'border-accent text-white' : 'border-transparent text-text-2 hover:text-white'}`}
        >
          Earnings Calendar
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden flex">
        <div className="flex-1 h-full overflow-y-auto relative">
          {activeTab === 'grid' && <EcosystemGrid onSelectTicker={setSelectedTicker} />}
          {activeTab === 'news' && <NewsFeed />}
          {activeTab === 'earnings' && <EarningsCalendar />}
        </div>
        
        {/* Detail Panel Sidebar */}
        {selectedTicker && <DetailPanel ticker={selectedTicker} onClose={() => setSelectedTicker(null)} />}
      </div>
    </div>
  );
}
