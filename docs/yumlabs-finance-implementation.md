---
title: finance-implementation
description: Document from d:\Documents\rust-projects\yumlabs\docs\finance-implementation.md
date: 2025-10-05
---

# Finance View Implementation

## Overview
Implemented a comprehensive finance view that fetches stock recommendations from Perplexity AI, queries real-time stock data from Finnhub API, and displays it in a beautiful UI with intelligent caching.

## Features Implemented

### 1. **Smart Data Caching**
- Checks MongoDB for existing finance data before making API calls
- Only fetches new data if cached data is older than 1 day
- Saves API calls and improves performance

### 2. **Two-Stage Data Fetching**
1. **Stage 1: Get Recommendations** (Perplexity AI)
   - Queries Perplexity with market analysis prompt
   - Parses response to extract stock symbols
   - Extracts analysis text for display

2. **Stage 2: Fetch Real-Time Quotes** (Finnhub API)
   - Takes symbols from Perplexity response
   - Fetches current stock data for each symbol
   - Displays: current price, change, % change, high, low, open, previous close

### 3. **Beautiful UI Display**
- **Header**: Back button and refresh button
- **Title Row**: Shows "Stock Market" with last update timestamp
- **Analysis Section**: Displays Perplexity's market analysis in a styled card
- **Stock Quote Cards**: Each stock gets its own card with:
  - Symbol and current price
  - Change amount and percentage (color-coded: green for positive, red for negative)
  - Detailed stats: Open, High, Low, Previous Close
- **Scrollable**: All content is scrollable for multiple stocks
- **Loading States**: Shows loading indicator while fetching data
- **Error Handling**: Displays errors clearly

## New Files Created

### `src/finance.rs`
Core finance data structures and database operations:
- `StockRecommendation`: Holds symbols and analysis from Perplexity
- `StockQuote`: Real-time stock data from Finnhub
- `FinanceData`: Combined data structure stored in MongoDB
- Database functions:
  - `save_finance_data()`: Save to MongoDB
  - `get_latest_finance_data()`: Retrieve most recent data
  - `should_refresh_finance_data()`: Check if cache is stale (>1 day old)
- Parsing functions:
  - `parse_symbols_from_response()`: Extract stock symbols from Perplexity response
  - `parse_analysis_from_response()`: Extract analysis text

## Modified Files

### `src/api.rs`
Added Finnhub API integration:
- `FinnhubQuote`: Response structure from Finnhub API
- `fetch_stock_quote()`: Fetch single stock quote
- `fetch_multiple_quotes()`: Fetch quotes for multiple symbols

### `src/models.rs`
Updated finance state and messages:
- `FinanceState`: Now holds `Option<FinanceData>` and `last_updated` timestamp
- `FinanceMessage`: Expanded to handle multi-stage workflow:
  - `Load`: Initial trigger
  - `CheckCache`: Check database for cached data
  - `CacheChecked`: Result of cache check
  - `FetchRecommendations`: Get symbols from Perplexity
  - `RecommendationsReceived`: Process Perplexity response
  - `FetchQuotes`: Get real-time data from Finnhub
  - `QuotesReceived`: Process Finnhub data
  - `DataReady`: Final data ready to display

### `src/update/finance_updater.rs`
Complete rewrite with sophisticated state machine:
1. **Load** → Check cache
2. **CacheChecked(Some)** → Display cached data
3. **CacheChecked(None)** → Fetch recommendations from Perplexity
4. **RecommendationsReceived** → Parse symbols, fetch quotes from Finnhub
5. **QuotesReceived** → Save to database, display data
- Added `format_timestamp()` helper for human-readable timestamps

### `src/view/finance_view.rs`
Complete redesign with beautiful UI:
- `build_finance_view()`: Main view with header, title, and scrollable content
- `build_finance_data_display()`: Renders analysis and stock cards
- `build_stock_quote_card()`: Individual stock card with color-coded changes

### `src/mongo_connection.rs`
Added finance database connection:
- `get_finance_collection()`: Returns MongoDB collection for finance data

### `src/constants.rs`
Added new constants:
- `FINNHUB_API_URL`: Finnhub API endpoint
- `FINANCE_DB_NAME`: MongoDB database name
- `FINANCE_COLLECTION_NAME`: MongoDB collection name

### `src/main.rs`
Added finance module declaration

## Data Flow

```
User clicks "Finance" or "Refresh"
    ↓
Load message triggered
    ↓
Check MongoDB cache
    ↓
Is data < 1 day old?
    ↓ YES                    ↓ NO
Display cached data    Fetch from Perplexity
                            ↓
                       Parse symbols & analysis
                            ↓
                       Fetch quotes from Finnhub
                            ↓
                       Combine data
                            ↓
                       Save to MongoDB
                            ↓
                       Display to user
```

## API Integration

### Perplexity AI
- **Endpoint**: `https://api.perplexity.ai/chat/completions`
- **Model**: `sonar-reasoning`
- **Purpose**: Get stock symbol recommendations based on market analysis
- **Response Format**:
  ```
  symbols: [AAPL, MSFT, GOOGL]
  output: Analysis text explaining the recommendations...
  ```

### Finnhub
- **Endpoint**: `https://finnhub.io/api/v1/quote`
- **Purpose**: Get real-time stock quotes
- **Response Fields**:
  - `c`: Current price
  - `d`: Change
  - `dp`: Percent change
  - `h`: High
  - `l`: Low
  - `o`: Open
  - `pc`: Previous close

## Database Schema

### Collection: `finance_data`
```json
{
  "_id": ObjectId,
  "recommendation": {
    "symbols": ["AAPL", "MSFT", "GOOGL"],
    "analysis": "Market analysis text..."
  },
  "quotes": [
    {
      "symbol": "AAPL",
      "current_price": 175.50,
      "change": 2.30,
      "percent_change": 1.33,
      "high": 176.20,
      "low": 173.80,
      "open": 174.00,
      "previous_close": 173.20
    }
  ],
  "created_at": ISODate("2025-01-15T10:30:00Z")
}
```

## UI Features

### Color Coding
- **Green**: Positive stock changes (gains)
- **Red**: Negative stock changes (losses)
- **Gray**: Labels and secondary information

### Responsive Layout
- Fixed width cards for consistency
- Scrollable content area for multiple stocks
- Proper spacing and padding throughout

### User Feedback
- Loading indicator during API calls
- Error messages displayed clearly
- Timestamp shows data freshness
- Empty state with helpful message

## Testing Checklist

1. ✅ First load (no cache) - Should fetch from Perplexity + Finnhub
2. ✅ Second load (with cache < 1 day) - Should use cached data
3. ✅ Refresh button - Should force new fetch
4. ✅ Error handling - API failures display error messages
5. ✅ Symbol parsing - Correctly extracts symbols from Perplexity response
6. ✅ Multiple stocks - Displays all stocks in scrollable view
7. ✅ Color coding - Green for gains, red for losses
8. ✅ Timestamp - Shows "Just now", "X minutes ago", etc.

## Future Enhancements

1. **Manual Symbol Entry**: Allow users to add custom stock symbols
2. **Watchlist**: Save favorite symbols for quick access
3. **Charts**: Add price history charts using a charting library
4. **Alerts**: Set price alerts for specific stocks
5. **More Data**: Add volume, market cap, P/E ratio, etc.
6. **Refresh Interval**: Auto-refresh every X minutes
7. **Export**: Export data to CSV or JSON
8. **Comparison**: Compare multiple stocks side-by-side

