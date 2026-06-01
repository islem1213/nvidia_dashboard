import os
import logging
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import fetcher functions
from fetchers import (
    get_ecosystem_data,
    get_kpi_data,
    get_company_details,
    get_news_data,
    get_earnings_data,
    FINNHUB_API_KEY
)

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="NVIDIA Ecosystem Tracker API",
    description="Backend API for monitoring NVIDIA's suppliers, partners, and investments.",
    version="1.0.0"
)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nvidia-tracker")

# CORS Settings
origins = [
    "http://localhost:5173",  # React standard dev port
    "http://127.0.0.1:5173",
]

# Allow custom CORS origin from environment variable
custom_origins = os.getenv("CORS_ORIGINS")
if custom_origins:
    origins.extend([origin.strip() for origin in custom_origins.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("\n" + "="*80)
    print("                      NVIDIA ECOSYSTEM TRACKER STARTUP")
    print("="*80)
    if not FINNHUB_API_KEY:
        print("💡 [NOTICE] FINNHUB_API_KEY is missing from backend/.env!")
        print("   The backend will seamlessly fallback to yfinance for news and use a")
        print("   seeded simulated calendar for upcoming earnings. There is no block.")
        print("   To enable live Finnhub news and real earnings, add to your backend/.env:")
        print("   FINNHUB_API_KEY=your_api_key_here")
    else:
        print("✅ Finnhub API configuration loaded successfully.")
    print("="*80 + "\n")

@app.get("/api/kpi")
def read_kpis():
    """
    Returns general tracker performance statistics.
    Includes NVDA price, ecosystem market cap, earnings count, and daily average.
    """
    try:
        data = get_kpi_data()
        return data
    except Exception as e:
        logger.error(f"KPI Endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error calculating KPIs")

@app.get("/api/ecosystem")
def read_ecosystem():
    """
    Returns aggregated pricing and financial indicators for all registry companies.
    """
    try:
        data = get_ecosystem_data()
        return data
    except Exception as e:
        logger.error(f"Ecosystem Endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error fetching ecosystem grid")

@app.get("/api/company/{ticker}")
def read_company_details(ticker: str, period: str = Query("1D", regex="^(1D|1W|1M|1Y|5Y)$")):
    """
    Returns detailed specifications for a single ticker.
    Includes role description, fundamentals, price history chart, and recent news.
    """
    try:
        data = get_company_details(ticker.upper(), period)
        return data
    except Exception as e:
        logger.error(f"Company Detail Endpoint error for {ticker}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error fetching details for {ticker}")

@app.get("/api/news")
def read_news(ticker: str = None, category: str = None):
    """
    Returns news aggregate feed. Supports filtering by ticker symbol or category role.
    """
    try:
        data = get_news_data(
            ticker=ticker.upper() if ticker else None,
            category=category
        )
        return data
    except Exception as e:
        logger.error(f"News Endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error fetching news feed")

@app.get("/api/earnings")
def read_earnings():
    """
    Returns upcoming earnings calendar. Highlighted for the next 7 days in the frontend.
    """
    try:
        data = get_earnings_data()
        return data
    except Exception as e:
        logger.error(f"Earnings Endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error fetching earnings calendar")
