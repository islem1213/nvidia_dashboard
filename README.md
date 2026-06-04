# NVIDIA Ecosystem Stock Dashboard

A stock dashboard for tracking companies connected to the NVIDIA AI infrastructure ecosystem. The interface is designed with a futuristic fintech feel inspired by Bloomberg, TradingView, and institutional portfolio tools.

## Features

- NVIDIA ecosystem tracker grouped by sectors:
  - IP
  - ARM
  - Fab
  - Memory
  - Networking
  - AI Infrastructure
- Collapsible company cards with ticker, company name, price, daily change, P/E ratio, market cap, and average cost.
- Detailed analytics panel for the selected company.
- TradingView-style price chart with:
  - Candlestick and line modes
  - SMA20, SMA50, and SMA200 overlays
  - Volume bars
  - Crosshair hover tooltip
  - Time filters for 1D, 5D, 1M, 3M, 1Y, and 5Y
- Relative performance comparison chart versus NVDA and SPY.
- Responsive dark-mode interface with NVIDIA green accents, glassmorphism, soft shadows, and hover animations.
- Curated fallback market data so the dashboard still renders when the backend is offline.

## Tech Stack

### Frontend

- React
- Vite
- TailwindCSS
- Framer Motion
- Lightweight Charts
- Recharts
- Lucide React icons
- SWR

### Backend

- FastAPI
- Uvicorn
- yfinance
- pandas
- httpx
- python-dotenv
- cachetools

## Project Structure

```text
nvidia dashboard/
  backend/
    main.py
    fetchers.py
    tickers.py
    requirements.txt
  frontend/
    src/
      components/
      data/
      hooks/
      App.jsx
      index.css
    package.json
    vite.config.js
    tailwind.config.js
```

## Getting Started

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Run the frontend

```bash
npm run dev
```

The app will usually be available at:

```text
http://127.0.0.1:5173
```

### 3. Install backend dependencies

From the project root:

```bash
cd backend
pip install -r requirements.txt
```

### 4. Run the backend

```bash
uvicorn main:app --reload
```

The backend defaults to:

```text
http://localhost:8000
```

The frontend reads the backend URL from `VITE_API_BASE`. If it is not set, it uses `http://localhost:8000`.

## Frontend Scripts

Run these inside `frontend/`.

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

This project currently combines backend-driven market data with curated frontend fallback data. If the API is unavailable, the dashboard still displays realistic sample data for the NVIDIA ecosystem so the UI remains usable during development.

Market data and financial metrics are for dashboard/demo purposes only and should not be treated as investment advice.

## Design Direction

The dashboard is dark mode only and uses:

- Background: `#0B0F14`
- Card surfaces: `#111827`
- Border tone: `#1F2937`
- NVIDIA accent green: `#8CFF3F`
- Positive: green
- Negative: red
- SMA yellow, blue, and violet chart overlays

The goal is a polished, investor-grade experience: data-dense, responsive, minimal, and high-end without feeling noisy.
