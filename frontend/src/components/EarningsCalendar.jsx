import React from 'react';
import { Calendar as CalendarIcon, Sunrise, Sunset } from 'lucide-react';
import { useEarnings } from '../hooks/useMarket';

export default function EarningsCalendar() {
  const { earnings, isLoading } = useEarnings();

  const now = new Date();
  const next7Days = new Date(now);
  next7Days.setDate(next7Days.getDate() + 7);

  return (
    <div className="p-6 h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <CalendarIcon size={24} className="text-white" />
        <h2 className="text-white text-xl font-bold">Earnings Calendar</h2>
      </div>

      <div className="bg-card rounded-xl border border-gray-800 overflow-hidden flex-1 flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-5 bg-gray-900/50 p-4 border-b border-gray-800 text-[11px] font-semibold text-muted uppercase tracking-wider">
          <div>Date</div>
          <div>Ticker</div>
          <div>Time</div>
          <div>EPS Est.</div>
          <div>Rev Est.</div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto hide-scrollbar flex-1 p-2">
          {isLoading && !earnings ? (
            <div className="flex flex-col gap-2 p-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-12 w-full bg-gray-800 rounded shimmer-bg" />
              ))}
            </div>
          ) : earnings && earnings.length > 0 ? (
            <div className="flex flex-col gap-1">
              {earnings.map((item, idx) => {
                const itemDate = new Date(item.date);
                // Ensure timezone safety by zeroing out time for comparison
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const reportDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
                const targetEnd = new Date(next7Days.getFullYear(), next7Days.getMonth(), next7Days.getDate());
                
                const isNext7Days = reportDay >= today && reportDay <= targetEnd;

                return (
                  <div 
                    key={idx} 
                    className={`grid grid-cols-5 p-4 rounded-lg items-center transition-colors ${isNext7Days ? 'bg-accent/10 border border-accent/30' : 'hover:bg-gray-800 border border-transparent'}`}
                  >
                    <div className="text-[14px] text-white font-medium flex items-center gap-2">
                      {isNext7Days && <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" title="Next 7 Days" />}
                      {formatDate(item.date)}
                    </div>
                    <div className="text-[14px] font-bold text-white">
                      {item.ticker}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-muted">
                      {item.bmo_amc === 'BMO' ? (
                        <><Sunrise size={14} className="text-yellow-500" /> Before Open</>
                      ) : (
                        <><Sunset size={14} className="text-orange-500" /> After Close</>
                      )}
                    </div>
                    <div className="text-[13px] text-gray-300">
                      {item.eps_estimate ? item.eps_estimate : '-'}
                    </div>
                    <div className="text-[13px] text-gray-300">
                      {item.revenue_estimate ? item.revenue_estimate : '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted italic text-sm">
              No upcoming earnings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
