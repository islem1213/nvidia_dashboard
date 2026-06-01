import React, { useState } from 'react';
import { X, ExternalLink, AlertCircle } from 'lucide-react';
import { useCompanyDetails } from '../hooks/useMarket';
import PriceChart from './PriceChart';

export default function DetailPanel({ ticker, onClose }) {
  const [period, setPeriod] = useState('1D');
  const { details, isLoading } = useCompanyDetails(ticker, period);

  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-[480px] bg-bg-base border-l border-gray-800 shadow-2xl transform transition-transform duration-200 ease-out translate-x-0 z-20 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-xl font-bold">{ticker}</h2>
          {details?.acquired && (
            <span className="text-[10px] uppercase font-medium bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">
              Acquired
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className="text-text-2 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
        {!details && isLoading ? (
          <div className="flex flex-col gap-6">
            <div className="h-20 shimmer-bg rounded" />
            <div className="h-48 shimmer-bg rounded" />
            <div className="h-32 shimmer-bg rounded" />
          </div>
        ) : details ? (
          <>
            {/* Header / Name */}
            <div className="mb-4">
              <h3 className="text-white text-lg">{details.name}</h3>
              <p className="text-text-2 text-sm">{details.category}</p>
            </div>

            {/* Role */}
            <div className="bg-bg-card p-4 rounded-lg border border-gray-800 mb-6">
              <p className="text-[13px] text-gray-300 leading-relaxed">
                {details.role}
              </p>
            </div>

            {/* Chart Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium text-sm">Price History</h4>
                <div className="flex gap-1 bg-bg-card p-1 rounded-md border border-gray-800">
                  {['1D', '1W', '1M', '1Y', '5Y'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${period === p ? 'bg-gray-700 text-white' : 'text-text-2 hover:text-gray-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <PriceChart 
                data={details.chart} 
                isPositive={details.chart && details.chart.length > 0 && details.chart[details.chart.length - 1].price >= details.chart[0].price} 
              />
              {details.stale && (
                <div className="flex items-center gap-1.5 text-yellow-500 text-[11px] mt-2">
                  <AlertCircle size={12} /> Showing cached/stale data
                </div>
              )}
            </div>

            {/* Fundamentals */}
            <div className="mb-6">
              <h4 className="text-white font-medium text-sm mb-3">Key Fundamentals</h4>
              <div className="grid grid-cols-2 gap-3">
                <StatBox label="Market Cap" value={formatCap(details.fundamentals?.market_cap)} />
                <StatBox label="P/E Ratio" value={details.fundamentals?.pe_ratio !== "N/A" ? parseFloat(details.fundamentals?.pe_ratio).toFixed(2) : "-"} />
                <StatBox label="Forward P/E" value={details.fundamentals?.forward_pe !== "N/A" ? parseFloat(details.fundamentals?.forward_pe).toFixed(2) : "-"} />
                <StatBox label="Div Yield" value={details.fundamentals?.dividend_yield !== "N/A" ? (parseFloat(details.fundamentals?.dividend_yield) * 100).toFixed(2) + "%" : "-"} />
                <StatBox label="52W High" value={details.fundamentals?.fifty_two_week_high !== "N/A" ? "$" + parseFloat(details.fundamentals?.fifty_two_week_high).toFixed(2) : "-"} />
                <StatBox label="52W Low" value={details.fundamentals?.fifty_two_week_low !== "N/A" ? "$" + parseFloat(details.fundamentals?.fifty_two_week_low).toFixed(2) : "-"} />
              </div>
            </div>

            {/* Recent News */}
            <div>
              <h4 className="text-white font-medium text-sm mb-3">Recent News</h4>
              <div className="flex flex-col gap-3">
                {details.news && details.news.length > 0 ? (
                  details.news.map((item, idx) => (
                    <a 
                      key={idx} 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group p-3 bg-bg-card border border-gray-800 rounded-lg hover:border-gray-600 transition-colors block"
                    >
                      <h5 className="text-[13px] text-white font-medium mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
                        {item.title}
                      </h5>
                      <div className="flex items-center justify-between text-[11px] text-text-2">
                        <span>{item.source}</span>
                        <span className="flex items-center gap-1">
                          {formatTime(item.timestamp)}
                          <ExternalLink size={10} />
                        </span>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-[13px] text-text-2 italic">No recent news available.</p>
                )}
              </div>
            </div>

          </>
        ) : (
          <div className="text-text-2 text-sm text-center mt-10">Failed to load details.</div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-bg-card p-3 rounded-lg border border-gray-800">
      <div className="text-[11px] uppercase tracking-wide text-text-2 mb-1">{label}</div>
      <div className="text-[13px] font-medium text-white">{value}</div>
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
