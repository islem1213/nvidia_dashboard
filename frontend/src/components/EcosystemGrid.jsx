import React from 'react';
import CompanyCard from './CompanyCard';
import { useEcosystem } from '../hooks/useMarket';

export default function EcosystemGrid({ onSelectTicker }) {
  const { ecosystem, isLoading } = useEcosystem();

  if (isLoading && !ecosystem) {
    return (
      <div className="p-6">
        {[1, 2, 3].map((section) => (
          <div key={section} className="mb-8">
            <div className="h-6 w-32 bg-gray-800 rounded shimmer-bg mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((card) => (
                <div key={card} className="h-32 bg-bg-card rounded-lg shimmer-bg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const data = ecosystem || {};
  
  // Group by category
  const categoriesMap = {};
  Object.keys(data).forEach(ticker => {
    // NVDA is shown in KPI, usually we don't put it in the grid, but if it's there we can skip or include.
    if (ticker === 'NVDA') return; 
    
    const info = data[ticker];
    if (!categoriesMap[info.category]) {
      categoriesMap[info.category] = [];
    }
    categoriesMap[info.category].push({ ticker, ...info });
  });

  // Sort categories conceptually (IP, Fab, Memory, etc.)
  const categoryOrder = [
    "IP", "Fab", "Memory", "Packaging", "Equipment", 
    "Networking", "Server OEMs", "Power Systems", 
    "Power Electronics", "Investments"
  ];
  
  const sortedCategories = Object.keys(categoriesMap).sort((a, b) => {
    const idxA = categoryOrder.indexOf(a);
    const idxB = categoryOrder.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="p-6 pb-20">
      {sortedCategories.map(category => (
        <div key={category} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-white text-lg font-bold tracking-wide">{category}</h2>
            <div className="h-px bg-gray-800 flex-grow" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categoriesMap[category].map(company => (
              <CompanyCard 
                key={company.ticker} 
                ticker={company.ticker} 
                data={company} 
                onClick={() => onSelectTicker(company.ticker)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
