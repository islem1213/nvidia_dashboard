const COMPANIES = {
  TSM: {
    ticker: 'TSM',
    name: 'Taiwan Semiconductor',
    price: 181.42,
    change: 2.29,
    pe: 34.6,
    marketCap: 802e9,
    avgCost: 142.18,
    role: 'Manufactures NVIDIA cutting-edge GPUs including H100, H200 and Blackwell series on advanced process nodes.',
  },
  ARM: {
    ticker: 'ARM',
    name: 'Arm Holdings',
    price: 134.88,
    change: 1.74,
    pe: 91.8,
    marketCap: 141e9,
    avgCost: 116.2,
    role: 'Licenses CPU architecture used across accelerated computing, Grace CPU roadmaps and edge AI designs.',
  },
  ASML: {
    ticker: 'ASML',
    name: 'ASML Holding',
    price: 984.15,
    change: 0.86,
    pe: 43.2,
    marketCap: 388e9,
    avgCost: 824.5,
    role: 'Supplies EUV lithography systems that enable leading-edge NVIDIA silicon production at foundry partners.',
  },
  AMAT: {
    ticker: 'AMAT',
    name: 'Applied Materials',
    price: 218.34,
    change: 1.12,
    pe: 27.4,
    marketCap: 180e9,
    avgCost: 176.25,
    role: 'Provides semiconductor equipment used in advanced wafer fabrication and packaging capacity buildouts.',
  },
  MU: {
    ticker: 'MU',
    name: 'Micron Technology',
    price: 129.77,
    change: -0.64,
    pe: 18.3,
    marketCap: 144e9,
    avgCost: 102.8,
    role: 'Supplies HBM and DRAM capacity essential to AI accelerator bandwidth and server-scale inference.',
  },
  SNPS: {
    ticker: 'SNPS',
    name: 'Synopsys',
    price: 584.2,
    change: 0.92,
    pe: 47.1,
    marketCap: 90e9,
    avgCost: 512.4,
    role: 'Provides EDA, verification and IP tools used to design increasingly complex GPU and networking silicon.',
  },
  CDNS: {
    ticker: 'CDNS',
    name: 'Cadence Design',
    price: 312.66,
    change: 1.36,
    pe: 54.5,
    marketCap: 85e9,
    avgCost: 268.15,
    role: 'Delivers chip design software and simulation workflows for advanced AI, networking and packaging systems.',
  },
  AVGO: {
    ticker: 'AVGO',
    name: 'Broadcom',
    price: 1765.42,
    change: 2.08,
    pe: 38.7,
    marketCap: 822e9,
    avgCost: 1240.0,
    role: 'Builds networking, switching and custom accelerator silicon adjacent to NVIDIA data center platforms.',
  },
  MRVL: {
    ticker: 'MRVL',
    name: 'Marvell Technology',
    price: 86.12,
    change: -1.18,
    pe: 42.9,
    marketCap: 75e9,
    avgCost: 69.4,
    role: 'Provides optical DSPs, data center interconnect silicon and custom AI infrastructure connectivity.',
  },
  INTC: {
    ticker: 'INTC',
    name: 'Intel',
    price: 31.56,
    change: -0.48,
    pe: 29.1,
    marketCap: 134e9,
    avgCost: 36.75,
    role: 'Competes and partners across CPUs, foundry ambitions, networking and AI infrastructure platforms.',
  },
  SMCI: {
    ticker: 'SMCI',
    name: 'Super Micro Computer',
    price: 842.25,
    change: 3.12,
    pe: 31.5,
    marketCap: 49e9,
    avgCost: 605.35,
    role: 'Builds high-density NVIDIA GPU servers, liquid-cooled racks and enterprise AI infrastructure.',
  },
  DELL: {
    ticker: 'DELL',
    name: 'Dell Technologies',
    price: 143.18,
    change: 1.58,
    pe: 21.7,
    marketCap: 101e9,
    avgCost: 96.1,
    role: 'Packages NVIDIA accelerators into enterprise AI factories, storage systems and managed infrastructure.',
  },
  NVDA: {
    ticker: 'NVDA',
    name: 'NVIDIA',
    price: 124.3,
    change: 2.86,
    pe: 56.4,
    marketCap: 3.05e12,
    avgCost: 72.4,
    role: 'Anchors the ecosystem with GPUs, networking, software, DGX systems and full-stack AI computing platforms.',
  },
};

export const SECTORS = [
  { id: 'ip', name: 'IP', companies: [COMPANIES.SNPS, COMPANIES.CDNS] },
  { id: 'arm', name: 'ARM', companies: [COMPANIES.ARM] },
  { id: 'fab', name: 'Fab', companies: [COMPANIES.TSM, COMPANIES.ASML, COMPANIES.AMAT] },
  { id: 'memory', name: 'Memory', companies: [COMPANIES.MU] },
  { id: 'networking', name: 'Networking', companies: [COMPANIES.AVGO, COMPANIES.MRVL, COMPANIES.INTC] },
  { id: 'ai-infrastructure', name: 'AI Infrastructure', companies: [COMPANIES.NVDA, COMPANIES.SMCI, COMPANIES.DELL] },
];

export const DEFAULT_SELECTED_TICKER = 'TSM';

export function getCompanyByTicker(ticker) {
  return COMPANIES[ticker] || COMPANIES.TSM;
}

export function formatMarketCap(value) {
  if (!value) return '-';
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
  return `$${(value / 1e6).toFixed(0)}M`;
}

export function buildChartData(company, period = '1D') {
  const counts = { '1D': 96, '5D': 120, '1M': 132, '3M': 150, '1Y': 180, '5Y': 220 };
  const count = counts[period] || 120;
  const volatility = Math.max(0.6, Math.abs(company.change) / 2);
  const start = company.price / (1 + company.change / 100);

  return Array.from({ length: count }, (_, index) => {
    const progress = index / Math.max(1, count - 1);
    const trend = start + (company.price - start) * progress;
    const wave = Math.sin(index * 0.22) * volatility + Math.cos(index * 0.071) * volatility * 0.55;
    const close = Math.max(2, trend + wave);
    const open = Math.max(2, close - Math.sin(index * 0.31) * volatility * 0.9);
    const high = Math.max(open, close) + volatility * (0.45 + ((index % 7) / 18));
    const low = Math.min(open, close) - volatility * (0.45 + ((index % 5) / 20));
    return {
      time: index,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.round((1.2 + Math.abs(Math.sin(index * 0.17)) * 2.8) * 1000000),
    };
  });
}

export function buildFallbackDetails(ticker, period = '1D') {
  const company = getCompanyByTicker(ticker);
  return {
    name: company.name,
    role: company.role,
    chart: buildChartData(company, period),
    fundamentals: {
      market_cap: company.marketCap,
      pe_ratio: company.pe,
      dividend_yield: ticker === 'TSM' ? 0.014 : 0,
      fifty_two_week_high: company.price * 1.16,
      fifty_two_week_low: company.price * 0.62,
    },
    news: [
      { title: `${company.ticker} expands role in AI infrastructure supply chain`, source: 'Market Desk', timestamp: Date.now() / 1000 },
      { title: `Analysts track ${company.name} exposure to NVIDIA demand`, source: 'Fintech Wire', timestamp: Date.now() / 1000 - 86400 },
    ],
    fallback: true,
  };
}
