import React, { useState } from 'react';
import { ExternalLink, Filter } from 'lucide-react';
import { useNews } from '../hooks/useMarket';

export default function NewsFeed() {
  const [filterType, setFilterType] = useState('all'); // 'all', 'category', 'ticker'
  const [filterValue, setFilterValue] = useState('');
  
  const tickerQuery = filterType === 'ticker' && filterValue ? filterValue : null;
  const categoryQuery = filterType === 'category' && filterValue ? filterValue : null;

  const { news, isLoading } = useNews(tickerQuery, categoryQuery);

  const categories = [
    "IP", "Fab", "Memory", "Packaging", "Equipment", 
    "Networking", "Server OEMs", "Power Systems", 
    "Power Electronics", "Investments"
  ];

  return (
    <div className="p-6 h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-white text-xl font-bold">Global Ecosystem News</h2>
        
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-text-2" />
          <select 
            className="bg-bg-card border border-gray-800 text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:border-accent"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue('');
            }}
          >
            <option value="all">All News</option>
            <option value="category">By Category</option>
            <option value="ticker">By Ticker</option>
          </select>

          {filterType === 'category' && (
            <select
              className="bg-bg-card border border-gray-800 text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:border-accent"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          {filterType === 'ticker' && (
            <input 
              type="text"
              placeholder="e.g. TSM, ARM"
              className="bg-bg-card border border-gray-800 text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:border-accent w-32 uppercase"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value.toUpperCase())}
            />
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-10 pr-2">
        {isLoading && !news ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-bg-card rounded-xl shimmer-bg border border-gray-800" />
            ))}
          </div>
        ) : news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((item, idx) => (
              <a 
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-bg-card border border-gray-800 p-5 rounded-xl hover:border-accent transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-bg-base bg-accent px-2 py-0.5 rounded">
                      {item.ticker}
                    </span>
                    <span className="text-text-2 text-[11px] font-medium">{item.source}</span>
                  </div>
                  <h3 className="text-white text-sm font-semibold mb-3 group-hover:text-accent transition-colors line-clamp-3">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                  <span className="text-text-2 text-[11px]">{formatTime(item.timestamp)}</span>
                  <ExternalLink size={14} className="text-text-2 group-hover:text-accent transition-colors" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-2 bg-bg-card rounded-xl border border-gray-800 border-dashed">
            No news found for the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(ts) {
  if (!ts) return '';
  const date = new Date(ts * 1000);
  return date.toLocaleString(undefined, { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}
