import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function CompanyCard({ ticker, data, onClick }) {
  if (!data) return <div className="h-32 bg-bg-card rounded-lg shimmer-bg" />;

  const isPositive = data.change >= 0;
  
  return (
    <div 
      onClick={onClick}
      className="bg-bg-card rounded-xl p-4 border border-gray-800 hover:border-accent cursor-pointer transition-all duration-120 hover:-translate-y-px"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-[18px]">{ticker}</h3>
            {data.acquired && (
              <span className="text-[10px] uppercase font-medium bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">
                Acquired
              </span>
            )}
          </div>
          <p className="text-text-2 text-[13px] truncate max-w-[140px]">{data.name}</p>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold text-[18px]">
            ${data.price ? data.price.toFixed(2) : '0.00'}
          </div>
          <div className={`flex items-center justify-end text-[13px] font-medium ${isPositive ? 'text-positive' : 'text-negative'}`}>
            {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {Math.abs(data.change || 0).toFixed(2)}%
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-800/50">
        <div>
          <div className="text-text-2 text-[11px] uppercase tracking-wide">Mkt Cap</div>
          <div className="text-white text-[13px]">{formatCap(data.market_cap)}</div>
        </div>
        <div>
          <div className="text-text-2 text-[11px] uppercase tracking-wide">P/E</div>
          <div className="text-white text-[13px]">{data.pe !== "N/A" ? parseFloat(data.pe).toFixed(1) : "-"}</div>
        </div>
        <div>
          <div className="text-text-2 text-[11px] uppercase tracking-wide">YTD %</div>
          <div className={`text-[13px] ${data.ytd >= 0 ? 'text-positive' : 'text-negative'}`}>
            {data.ytd ? (data.ytd > 0 ? '+' : '') + data.ytd.toFixed(1) + '%' : '-'}
          </div>
        </div>
        <div>
          <div className="text-text-2 text-[11px] uppercase tracking-wide">1Y %</div>
          <div className={`text-[13px] ${data.one_year >= 0 ? 'text-positive' : 'text-negative'}`}>
            {data.one_year ? (data.one_year > 0 ? '+' : '') + data.one_year.toFixed(1) + '%' : '-'}
          </div>
        </div>
      </div>
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
