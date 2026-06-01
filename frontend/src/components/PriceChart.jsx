import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceChart({ data, isPositive }) {
  if (!data || data.length === 0) {
    return <div className="w-full h-48 bg-gray-900 rounded flex items-center justify-center text-text-2">No chart data available</div>;
  }

  // Determine color based on overall change
  const color = isPositive ? '#3FCF8E' : '#E5534B';

  // Calculate min and max for Y axis
  const prices = data.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const buffer = (max - min) * 0.1;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow-lg">
          <p className="text-white font-semibold">${payload[0].value.toFixed(2)}</p>
          <p className="text-text-2 text-xs">{payload[0].payload.time}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-48 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#8A8F98', fontSize: 10 }}
            minTickGap={30}
          />
          <YAxis 
            domain={[min - buffer, max + buffer]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#8A8F98', fontSize: 10 }}
            width={40}
            tickFormatter={(val) => `$${val.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
