import useSWR from 'swr';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const fetcher = (url) => fetch(url).then(res => res.json());

export function useKPI() {
  const { data, error, isLoading } = useSWR(`${API_BASE}/api/kpi`, fetcher, {
    refreshInterval: 60000,
  });
  return { kpi: data, error, isLoading };
}

export function useEcosystem() {
  const { data, error, isLoading } = useSWR(`${API_BASE}/api/ecosystem`, fetcher, {
    refreshInterval: 60000,
  });
  return { ecosystem: data, error, isLoading };
}

export function useCompanyDetails(ticker, period = '1D') {
  const { data, error, isLoading } = useSWR(
    ticker ? `${API_BASE}/api/company/${ticker}?period=${period}` : null,
    fetcher,
    { refreshInterval: 60000 }
  );
  return { details: data, error, isLoading };
}

export function useNews(ticker = null, category = null) {
  let url = `${API_BASE}/api/news?`;
  if (ticker) url += `ticker=${ticker}&`;
  if (category) url += `category=${category}&`;
  
  const { data, error, isLoading } = useSWR(url, fetcher, {
    refreshInterval: 60000,
  });
  return { news: data, error, isLoading };
}

export function useEarnings() {
  const { data, error, isLoading } = useSWR(`${API_BASE}/api/earnings`, fetcher, {
    refreshInterval: 60000,
  });
  return { earnings: data, error, isLoading };
}
