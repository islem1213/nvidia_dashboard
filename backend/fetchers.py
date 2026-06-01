import os
import time
import httpx
import logging
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv

from tickers import TICKER_REGISTRY, get_fetch_tickers
from cache import cache_store

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "").strip()
if not FINNHUB_API_KEY:
    logger.warning("FINNHUB_API_KEY is not set in .env! Backend will fallback to yfinance news and mock earnings.")

# TTLs in seconds
TTL_PRICES = 300       # 5 minutes
TTL_FUNDAMENTALS = 900 # 15 minutes
TTL_NEWS = 600         # 10 minutes
TTL_EARNINGS = 3600    # 60 minutes
TTL_HIST_1D = 300      # 5 minutes
TTL_HIST_LONG = 3600   # 60 minutes

def fetch_single_ticker_data(ticker: str):
    """
    Fetches 1 year of historical data and basic info for a single ticker.
    Calculates Price, Daily %, YTD %, 1Y % from history to ensure 100% reliability.
    """
    try:
        t = yf.Ticker(ticker)
        # Fetch 1y history for prices, changes, YTD and 1Y calculation
        hist = t.history(period="1y")
        if hist.empty:
            raise ValueError(f"No history returned for {ticker}")
        
        # Calculate pricing metrics
        price = float(hist.iloc[-1]['Close'])
        prev_close = float(hist.iloc[-2]['Close']) if len(hist) > 1 else price
        change = ((price - prev_close) / prev_close) * 100
        
        # YTD
        current_year = datetime.now().year
        hist_year = hist[hist.index.year == current_year]
        if not hist_year.empty:
            first_of_year = float(hist_year.iloc[0]['Close'])
        else:
            first_of_year = float(hist.iloc[0]['Close'])
        ytd = ((price - first_of_year) / first_of_year) * 100
        
        # 1Y
        first_of_1y = float(hist.iloc[0]['Close'])
        one_year = ((price - first_of_1y) / first_of_1y) * 100
        
        # Fetch fundamentals from info
        mkt_cap = "N/A"
        pe = "N/A"
        try:
            info = t.info
            mkt_cap = info.get("marketCap", "N/A")
            pe = info.get("trailingPE", "N/A")
        except Exception as e:
            logger.warning(f"Failed to fetch .info for {ticker}: {e}")
            
        return {
            "price": price,
            "change": change,
            "ytd": ytd,
            "one_year": one_year,
            "market_cap": mkt_cap,
            "pe": pe,
            "stale": False
        }
    except Exception as e:
        logger.error(f"Error fetching yfinance data for {ticker}: {e}")
        # Try to get stale data from cache
        stale_data = cache_store.get_stale(f"ticker_data_{ticker}")
        if stale_data:
            stale_data["stale"] = True
            return stale_data
        
        # Absolute fallback if no cache exists
        return {
            "price": 0.0,
            "change": 0.0,
            "ytd": 0.0,
            "one_year": 0.0,
            "market_cap": "N/A",
            "pe": "N/A",
            "stale": True,
            "error": str(e)
        }

def get_ecosystem_data():
    """
    Retrieves data for all tickers in the registry.
    Handles SNDK mapping and executes fetches concurrently.
    """
    # Check if complete ecosystem is cached
    cached = cache_store.get("ecosystem_all")
    if cached:
        return cached

    logger.info("Ecosystem cache expired/missing. Fetching from yfinance...")
    raw_tickers = get_fetch_tickers()
    
    results = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_single_ticker_data, ticker): ticker for ticker in raw_tickers}
        for future in futures:
            ticker = futures[future]
            try:
                results[ticker] = future.result()
            except Exception as e:
                logger.error(f"Exception during concurrent fetch for {ticker}: {e}")
                results[ticker] = {
                    "price": 0.0, "change": 0.0, "ytd": 0.0, "one_year": 0.0,
                    "market_cap": "N/A", "pe": "N/A", "stale": True, "error": str(e)
                }

    # Cache raw results for individual tickers
    for ticker, data in results.items():
        if not data.get("error"):
            cache_store.set(f"ticker_data_{ticker}", data, TTL_PRICES)

    # Compile the full ecosystem grid
    ecosystem = {}
    for ticker, info in TICKER_REGISTRY.items():
        if "mapped_ticker" in info:
            # Map SNDK to WDC
            target = info["mapped_ticker"]
            base_data = results.get(target, {}).copy()
            # Mark that this is a mapped acquired company
            base_data["name"] = info["name"]
            base_data["category"] = info["category"]
            base_data["role"] = info["role"]
            base_data["acquired"] = True
            ecosystem[ticker] = base_data
        else:
            base_data = results.get(ticker, {}).copy()
            base_data["name"] = info["name"]
            base_data["category"] = info["category"]
            base_data["role"] = info["role"]
            base_data["acquired"] = False
            ecosystem[ticker] = base_data

    cache_store.set("ecosystem_all", ecosystem, TTL_PRICES)
    return ecosystem

def get_kpi_data():
    """
    Calculates KPI bar figures.
    NVDA price/change, total ecosystem cap, reports this week, avg daily % performance.
    """
    cached = cache_store.get("kpis")
    if cached:
        return cached

    eco_data = get_ecosystem_data()
    nvda_raw = fetch_single_ticker_data("NVDA")
    
    total_cap = 0
    valid_changes = []
    
    for ticker, data in eco_data.items():
        # Exclude NVDA itself from ecosystem average daily performance calculations
        if ticker == "NVDA":
            continue
        
        change = data.get("change", 0.0)
        valid_changes.append(change)
        
        cap = data.get("market_cap", 0)
        if isinstance(cap, (int, float)):
            total_cap += cap

    avg_performance = sum(valid_changes) / len(valid_changes) if valid_changes else 0.0
    
    # Calculate companies reporting this week
    earnings = get_earnings_data()
    reporting_this_week = 0
    now = datetime.now()
    seven_days_later = now + timedelta(days=7)
    for row in earnings:
        try:
            report_date = datetime.strptime(row["date"], "%Y-%m-%d")
            if now.date() <= report_date.date() <= seven_days_later.date():
                reporting_this_week += 1
        except Exception:
            pass

    kpis = {
        "nvda_price": nvda_raw.get("price", 0.0),
        "nvda_change": nvda_raw.get("change", 0.0),
        "total_market_cap": total_cap,
        "reporting_this_week": reporting_this_week,
        "average_performance": avg_performance,
        "stale": any(data.get("stale", False) for data in eco_data.values()) or nvda_raw.get("stale", False)
    }

    cache_store.set("kpis", kpis, TTL_PRICES)
    return kpis

def get_company_details(ticker: str, period: str = "1D"):
    """
    Retrieves full details for a single company: history chart, fundamentals, role, news.
    """
    # Mappings
    actual_ticker = ticker
    acquired = False
    if ticker in TICKER_REGISTRY and "mapped_ticker" in TICKER_REGISTRY[ticker]:
        actual_ticker = TICKER_REGISTRY[ticker]["mapped_ticker"]
        acquired = True

    cache_key = f"detail_{ticker}_{period}"
    cached = cache_store.get(cache_key)
    if cached:
        return cached

    # Fetch history based on period
    # 1D, 1W, 1M, 1Y, 5Y
    interval = "1m"
    hist_period = "1d"
    ttl = TTL_HIST_1D
    
    if period == "1D":
        interval = "2m"
        hist_period = "1d"
        ttl = TTL_HIST_1D
    elif period == "1W":
        interval = "15m"
        hist_period = "5d"
        ttl = TTL_HIST_LONG
    elif period == "1M":
        interval = "1h"
        hist_period = "30d"
        ttl = TTL_HIST_LONG
    elif period == "1Y":
        interval = "1d"
        hist_period = "1y"
        ttl = TTL_HIST_LONG
    elif period == "5Y":
        interval = "1wk"
        hist_period = "5y"
        ttl = TTL_HIST_LONG

    chart_data = []
    stale = False
    try:
        t = yf.Ticker(actual_ticker)
        hist = t.history(period=hist_period, interval=interval)
        
        # If 1D data is empty (outside trading hours), fallback to last trading day
        if hist.empty and period == "1D":
            hist = t.history(period="2d", interval="2m")
            if not hist.empty:
                # Get only the last day's data
                last_date = hist.index[-1].date()
                hist = hist[hist.index.date == last_date]

        for idx, row in hist.iterrows():
            if pd.isna(row['Close']):
                continue
            
            # Format date for frontend
            if period in ["1D", "1W"]:
                time_str = idx.strftime("%H:%M") if hasattr(idx, 'strftime') else str(idx)
            else:
                time_str = idx.strftime("%b %d, %Y") if hasattr(idx, 'strftime') else str(idx)
                
            chart_data.append({
                "time": time_str,
                "price": float(row['Close']),
                "volume": int(row['Volume']) if not pd.isna(row['Volume']) else 0
            })
    except Exception as e:
        logger.error(f"Error fetching history for {ticker} ({period}): {e}")
        stale = True
        # Try fallback
        stale_detail = cache_store.get_stale(cache_key)
        if stale_detail:
            return stale_detail

    # Fetch fundamentals & role description
    role = TICKER_REGISTRY.get(ticker, {}).get("role", "NVIDIA Supply Chain Partner")
    name = TICKER_REGISTRY.get(ticker, {}).get("name", ticker)
    category = TICKER_REGISTRY.get(ticker, {}).get("category", "General")
    
    fundamentals = {}
    try:
        t = yf.Ticker(actual_ticker)
        info = t.info
        fundamentals = {
            "market_cap": info.get("marketCap", "N/A"),
            "pe_ratio": info.get("trailingPE", "N/A"),
            "forward_pe": info.get("forwardPE", "N/A"),
            "dividend_yield": info.get("dividendYield", "N/A"),
            "fifty_two_week_high": info.get("fiftyTwoWeekHigh", "N/A"),
            "fifty_two_week_low": info.get("fiftyTwoWeekLow", "N/A"),
            "volume": info.get("volume", "N/A"),
            "avg_volume": info.get("averageVolume", "N/A"),
        }
    except Exception as e:
        logger.warning(f"Error fetching fundamentals for {ticker}: {e}")
        stale = True
        fundamentals = {
            "market_cap": "N/A", "pe_ratio": "N/A", "forward_pe": "N/A",
            "dividend_yield": "N/A", "fifty_two_week_high": "N/A", "fifty_two_week_low": "N/A",
            "volume": "N/A", "avg_volume": "N/A"
        }

    # Fetch company-specific news
    news = get_news_data(ticker=ticker)

    details = {
        "ticker": ticker,
        "name": name,
        "category": category,
        "role": role,
        "acquired": acquired,
        "chart": chart_data,
        "fundamentals": fundamentals,
        "news": news[:5],  # Limit to 5 articles
        "stale": stale
    }

    cache_store.set(cache_key, details, ttl)
    return details

def get_news_data(ticker: str = None, category: str = None):
    """
    Fetches aggregated news. Filters by ticker or category.
    If Finnhub is configured, uses Finnhub, else falls back to yfinance.
    """
    cache_key = f"news_{ticker or 'all'}_{category or 'all'}"
    cached = cache_store.get(cache_key)
    if cached:
        return cached

    articles = []
    
    if FINNHUB_API_KEY:
        try:
            # Fetch from Finnhub
            headers = {"X-Finnhub-Token": FINNHUB_API_KEY}
            async_client = httpx.Client()
            if ticker:
                actual_ticker = TICKER_REGISTRY.get(ticker, {}).get("mapped_ticker", ticker)
                # Fetch company-specific news for past 7 days
                end_date = datetime.now().strftime("%Y-%m-%d")
                start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
                url = f"https://finnhub.io/api/v1/company-news?symbol={actual_ticker}&from={start_date}&to={end_date}"
                resp = async_client.get(url, headers=headers)
            else:
                # Fetch general market news
                url = "https://finnhub.io/api/v1/news?category=general"
                resp = async_client.get(url, headers=headers)

            if resp.status_code == 200:
                finnhub_news = resp.json()
                for item in finnhub_news:
                    articles.append({
                        "title": item.get("headline", ""),
                        "source": item.get("source", "Finnhub"),
                        "timestamp": int(item.get("datetime", time.time())),
                        "ticker": ticker or item.get("related", "Market"),
                        "url": item.get("url", "#"),
                        "summary": item.get("summary", "")
                    })
        except Exception as e:
            logger.error(f"Finnhub news call failed, falling back to yfinance: {e}")

    # Fallback to yfinance news
    if not articles:
        try:
            # If a specific ticker is requested, get its news
            tickers_to_query = [ticker] if ticker else ["NVDA", "ARM", "TSM", "MU", "DELL", "VRT"]
            
            # Fetch yfinance news in parallel
            def fetch_yf_news(sym):
                actual_sym = TICKER_REGISTRY.get(sym, {}).get("mapped_ticker", sym)
                try:
                    t = yf.Ticker(actual_sym)
                    return sym, t.news
                except Exception:
                    return sym, []
            
            with ThreadPoolExecutor(max_workers=5) as executor:
                results = executor.map(fetch_yf_news, tickers_to_query)
            
            for sym, yf_news in results:
                for item in yf_news:
                    # Map to unified structure
                    articles.append({
                        "title": item.get("title", ""),
                        "source": item.get("publisher", "Yahoo Finance"),
                        "timestamp": int(item.get("providerPublishTime", time.time())),
                        "ticker": sym,
                        "url": item.get("link", "#"),
                        "summary": item.get("summary", "")
                    })
        except Exception as e:
            logger.error(f"yfinance news aggregation failed: {e}")

    # Sort news by timestamp descending
    articles.sort(key=lambda x: x["timestamp"], reverse=True)

    # Filter articles by category if specified
    if category and not ticker:
        filtered = []
        for art in articles:
            art_ticker = art.get("ticker")
            if art_ticker in TICKER_REGISTRY:
                if TICKER_REGISTRY[art_ticker]["category"] == category:
                    filtered.append(art)
        articles = filtered

    # De-duplicate articles by title
    seen_titles = set()
    deduped = []
    for art in articles:
        title_lower = art["title"].lower().strip()
        if title_lower not in seen_titles and art["title"]:
            seen_titles.add(title_lower)
            deduped.append(art)
    articles = deduped

    cache_store.set(cache_key, articles, TTL_NEWS)
    return articles

def get_earnings_data():
    """
    Fetches earnings calendar. If Finnhub is configured, queries Finnhub.
    Otherwise, generates stable mock/simulated upcoming earnings.
    """
    cached = cache_store.get("earnings")
    if cached:
        return cached

    earnings_list = []

    if FINNHUB_API_KEY:
        try:
            # Query Finnhub earnings calendar for next 30 days
            start_date = datetime.now().strftime("%Y-%m-%d")
            end_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
            url = f"https://finnhub.io/api/v1/calendar/earnings?from={start_date}&to={end_date}"
            headers = {"X-Finnhub-Token": FINNHUB_API_KEY}
            with httpx.Client() as client:
                resp = client.get(url, headers=headers)
                if resp.status_code == 200:
                    data = resp.json().get("earningsCalendar", [])
                    # Filter for our tickers only
                    all_registry_tickers = set(TICKER_REGISTRY.keys()) | {"NVDA"}
                    for item in data:
                        ticker = item.get("symbol", "")
                        if ticker in all_registry_tickers:
                            earnings_list.append({
                                "date": item.get("date", ""),
                                "ticker": ticker,
                                "bmo_amc": "BMO" if item.get("hour", "") == "bmo" else "AMC",
                                "eps_estimate": item.get("epsEstimate", None),
                                "revenue_estimate": item.get("revenueEstimate", None)
                            })
        except Exception as e:
            logger.error(f"Finnhub earnings calendar failed, falling back to mock: {e}")

    # Fallback to generating a realistic, stable earnings calendar seeded by date
    if not earnings_list:
        logger.info("Generating simulated earnings calendar...")
        today = datetime.now()
        
        # We will distribute earnings for key tickers over the next 3 weeks
        # Seed by date so that it remains identical within the same day
        seed_day = today.strftime("%Y-%m-%d")
        import hashlib
        
        all_tickers = sorted(list(TICKER_REGISTRY.keys()) + ["NVDA"])
        
        for idx, ticker in enumerate(all_tickers):
            # Deterministic hash to assign date and estimates
            h = hashlib.md5(f"{seed_day}_{ticker}".encode()).hexdigest()
            h_int = int(h, 16)
            
            # Days offset: between 1 and 21 days from today
            days_offset = (h_int % 21) + 1
            report_date = today + timedelta(days=days_offset)
            
            # BMO or AMC
            bmo_amc = "BMO" if (h_int % 2 == 0) else "AMC"
            
            # Simulated estimates based on standard stock price ranges
            # EPS from -0.5 to 5.0
            eps_est = round(((h_int % 55) / 10.0) - 0.5, 2)
            
            # Revenue from 50M to 25B
            rev_est_m = (h_int % 24900) + 100
            if rev_est_m > 1000:
                rev_est = f"${round(rev_est_m / 1000, 2)}B"
            else:
                rev_est = f"${rev_est_m}M"
                
            earnings_list.append({
                "date": report_date.strftime("%Y-%m-%d"),
                "ticker": ticker,
                "bmo_amc": bmo_amc,
                "eps_estimate": eps_est,
                "revenue_estimate": rev_est
            })

    # Sort calendar by date ascending
    earnings_list.sort(key=lambda x: x["date"])

    cache_store.set("earnings", earnings_list, TTL_EARNINGS)
    return earnings_list
