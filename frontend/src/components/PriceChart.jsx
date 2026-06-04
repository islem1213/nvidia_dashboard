import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

// SMA calculation utility
function calculateSMA(data, period) {
  return data.map((item, index) => {
    if (index < period - 1) return null;
    const sum = data.slice(index - period + 1, index + 1).reduce((acc, d) => acc + d.close, 0);
    return sum / period;
  });
}

export default function PriceChart({ data, mode = 'candle' }) {
  const containerRef = useRef(null);
  const tooltipRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!data || data.length === 0 || !containerRef.current) return;

    setReady(false);
    const chart = createChart(containerRef.current, {
      layout: {
        textColor: '#9CA3AF',
        background: { color: '#080B10' },
        fontFamily: 'Inter, sans-serif',
      },
      width: containerRef.current.clientWidth,
      height: 430,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#1F2937',
        rightOffset: 10,
      },
      grid: {
        vertLines: { color: 'rgba(31, 41, 55, 0.55)' },
        hLines: { color: 'rgba(31, 41, 55, 0.55)' },
      },
      crosshair: {
        vertLine: { color: 'rgba(140, 255, 63, 0.35)' },
        horzLine: { color: 'rgba(140, 255, 63, 0.35)' },
      },
    });

    // Convert data to candlestick format with Unix timestamps
    const candleData = data.map((item, idx) => {
      const timestamp = Math.floor(Date.now() / 1000) - (data.length - idx) * 60;
      return {
        time: timestamp,
        open: item.open || item.close,
        high: item.high || item.close,
        low: item.low || item.close,
        close: item.close,
      };
    });

    const mainSeries = mode === 'line'
      ? chart.addLineSeries({
          color: '#8CFF3F',
          lineWidth: 2,
          crosshairMarkerVisible: true,
        })
      : chart.addCandlestickSeries({
          upColor: '#10B981',
          downColor: '#EF4444',
          borderUpColor: '#10B981',
          borderDownColor: '#EF4444',
          wickUpColor: '#10B981',
          wickDownColor: '#EF4444',
        });

    if (mode === 'line') {
      mainSeries.setData(candleData.map(({ time, close }) => ({ time, value: close })));
    } else {
      mainSeries.setData(candleData);
    }

    // Add volume histogram
    const volumeData = data.map((item, idx) => {
      const timestamp = Math.floor(Date.now() / 1000) - (data.length - idx) * 60;
      const close = item.close;
      const open = item.open || close;
      return {
        time: timestamp,
        value: item.volume || 0,
        color: close >= open ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
      };
    });

    const volumeSeries = chart.addHistogramSeries({
      color: 'rgba(16, 185, 129, 0.25)',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });
    volumeSeries.setData(volumeData);
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // Calculate SMAs
    const sma20 = calculateSMA(data, 20);
    const sma50 = calculateSMA(data, 50);
    const sma200 = calculateSMA(data, 200);

    // Add SMA20 line
    const sma20Series = chart.addLineSeries({
      color: '#EAB308',
      lineWidth: 1.5,
      crosshairMarkerVisible: true,
      title: 'SMA20',
    });
    const sma20Data = sma20.map((value, idx) => ({
      time: Math.floor(Date.now() / 1000) - (data.length - idx) * 60,
      value: value,
    })).filter(d => d.value !== null);
    sma20Series.setData(sma20Data);

    // Add SMA50 line
    const sma50Series = chart.addLineSeries({
      color: '#3B82F6',
      lineWidth: 1.5,
      crosshairMarkerVisible: true,
      title: 'SMA50',
    });
    const sma50Data = sma50.map((value, idx) => ({
      time: Math.floor(Date.now() / 1000) - (data.length - idx) * 60,
      value: value,
    })).filter(d => d.value !== null);
    sma50Series.setData(sma50Data);

    // Add SMA200 line
    const sma200Series = chart.addLineSeries({
      color: '#8B5CF6',
      lineWidth: 1.5,
      crosshairMarkerVisible: true,
      title: 'SMA200',
    });
    const sma200Data = sma200.map((value, idx) => ({
      time: Math.floor(Date.now() / 1000) - (data.length - idx) * 60,
      value: value,
    })).filter(d => d.value !== null);
    sma200Series.setData(sma200Data);

    // Price scale
    const priceScale = chart.priceScale('right');
    priceScale.applyOptions({
      borderColor: '#1F2937',
      scaleMargins: { top: 0.08, bottom: 0.24 },
    });

    chart.subscribeCrosshairMove((param) => {
      if (!tooltipRef.current || !param.time || !param.point) {
        if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
        return;
      }
      const candle = param.seriesData.get(mainSeries);
      if (!candle) return;
      const value = candle.close || candle.value;
      tooltipRef.current.style.opacity = '1';
      tooltipRef.current.style.left = `${Math.min(param.point.x + 18, containerRef.current.clientWidth - 155)}px`;
      tooltipRef.current.style.top = `${Math.max(param.point.y - 12, 12)}px`;
      tooltipRef.current.innerHTML = `<div class="text-[10px] uppercase tracking-[0.14em] text-[#9CA3AF]">Crosshair</div><div class="text-sm font-bold text-[#F9FAFB]">$${Number(value).toFixed(2)}</div>`;
    });

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    chartRef.current = chart;
    setReady(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, mode]);

  if (!data || data.length === 0) {
    return <div className="w-full h-96 bg-bg-elevated/30 rounded flex items-center justify-center text-text-secondary text-sm">No chart data available</div>;
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-[#080B10]">
        <div ref={containerRef} className={`w-full transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-40'}`} />
        <div ref={tooltipRef} className="pointer-events-none absolute z-10 rounded-xl border border-accent-neon/30 bg-[#0B0F14]/95 px-3 py-2 shadow-glow opacity-0 transition-opacity" />
      </div>
      <div className="flex gap-4 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#EAB308' }}></div>
          <span className="text-text-secondary">SMA20</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
          <span className="text-text-secondary">SMA50</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8B5CF6' }}></div>
          <span className="text-text-secondary">SMA200</span>
        </div>
      </div>
    </div>
  );
}
