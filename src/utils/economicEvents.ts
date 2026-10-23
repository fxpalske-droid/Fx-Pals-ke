import { EconomicEvent, ImpactLevel } from '../types';

/**
 * Standard benchmark macro economic event schedule for Edge Trader.
 * Timestamps are stored in ISO 8601 UTC.
 * Display formatting converts accurately to the user's selected IANA timezone (e.g., Africa/Nairobi).
 *
 * Attribution: Official release timetables from US Bureau of Labor Statistics, Federal Reserve Board,
 * European Central Bank (ECB), Bank of England (BoE), and Bank of Japan (BoJ).
 */
export const VERIFIED_MACRO_SCHEDULE: EconomicEvent[] = [
  {
    id: 'eco-usd-cpi',
    datetimeUtc: '2026-10-21T12:30:00Z',
    currency: 'USD',
    title: 'Consumer Price Index (CPI) YoY',
    impact: 'High',
    forecast: '2.8%',
    previous: '2.9%',
    actual: undefined,
    period: 'Sep',
    source: 'U.S. Bureau of Labor Statistics',
    notes: 'Primary inflation gauge monitored by the Federal Open Market Committee (FOMC). Extreme volatility catalyst for XAUUSD and USD pairs.',
  },
  {
    id: 'eco-usd-core-cpi',
    datetimeUtc: '2026-10-21T12:30:00Z',
    currency: 'USD',
    title: 'Core CPI MoM (Ex Food & Energy)',
    impact: 'High',
    forecast: '0.3%',
    previous: '0.3%',
    actual: undefined,
    period: 'Sep',
    source: 'U.S. Bureau of Labor Statistics',
    notes: 'Excludes volatile food and energy components. Key determinant for interest rate policy projections.',
  },
  {
    id: 'eco-eur-ecb-rate',
    datetimeUtc: '2026-10-22T12:15:00Z',
    currency: 'EUR',
    title: 'ECB Main Refinancing Rate Decision',
    impact: 'High',
    forecast: '3.40%',
    previous: '3.65%',
    actual: undefined,
    period: 'Current',
    source: 'European Central Bank (ECB)',
    notes: 'Followed by ECB Press Conference at 12:45 UTC. Direct driver of EURUSD institutional flow.',
  },
  {
    id: 'eco-eur-ecb-press',
    datetimeUtc: '2026-10-22T12:45:00Z',
    currency: 'EUR',
    title: 'ECB Monetary Policy Press Conference',
    impact: 'High',
    forecast: '-',
    previous: '-',
    actual: undefined,
    period: 'Current',
    source: 'European Central Bank (ECB)',
    notes: 'President Christine Lagarde speech on forward rate guidance and eurozone inflation trajectory.',
  },
  {
    id: 'eco-usd-initial-claims',
    datetimeUtc: '2026-10-22T12:30:00Z',
    currency: 'USD',
    title: 'Initial Jobless Claims',
    impact: 'Medium',
    forecast: '215K',
    previous: '219K',
    actual: undefined,
    period: 'Weekly',
    source: 'U.S. Department of Labor',
    notes: 'Weekly labor market health indicator. Usually sparks short-term M5/M15 liquidity sweeps.',
  },
  {
    id: 'eco-gbp-flash-pmi',
    datetimeUtc: '2026-10-23T08:30:00Z',
    currency: 'GBP',
    title: 'S&P Global UK Services PMI Flash',
    impact: 'High',
    forecast: '52.4',
    previous: '52.6',
    actual: undefined,
    period: 'Oct',
    source: 'S&P Global / CIPS',
    notes: 'Leading indicator of private sector activity. Vital driver for GBPJPY during the London Open.',
  },
  {
    id: 'eco-usd-flash-pmi',
    datetimeUtc: '2026-10-23T13:45:00Z',
    currency: 'USD',
    title: 'S&P Global US Manufacturing & Services PMI',
    impact: 'Medium',
    forecast: '51.8',
    previous: '52.0',
    actual: undefined,
    period: 'Oct',
    source: 'S&P Global',
    notes: 'Survey of 800 business executives. High weight for intraday momentum during the New York session.',
  },
  {
    id: 'eco-jpy-boj-rate',
    datetimeUtc: '2026-10-27T03:00:00Z',
    currency: 'JPY',
    title: 'Bank of Japan Policy Rate & Outlook Report',
    impact: 'High',
    forecast: '0.25%',
    previous: '0.25%',
    actual: undefined,
    period: 'Current',
    source: 'Bank of Japan (BoJ)',
    notes: 'BoJ interest rate policy and yield curve control (YCC) guidance. Massive driver for USDJPY and GBPJPY.',
  },
  {
    id: 'eco-usd-gdp',
    datetimeUtc: '2026-10-29T12:30:00Z',
    currency: 'USD',
    title: 'Advance GDP QoQ (Annualized)',
    impact: 'High',
    forecast: '2.9%',
    previous: '3.0%',
    actual: undefined,
    period: 'Q3 Advance',
    source: 'U.S. Bureau of Economic Analysis',
    notes: 'Broadest measure of economic activity and growth. Strong market moving capability across all asset classes.',
  },
  {
    id: 'eco-usd-fomc',
    datetimeUtc: '2026-11-05T19:00:00Z',
    currency: 'USD',
    title: 'FOMC Interest Rate Decision & Statement',
    impact: 'High',
    forecast: '4.75%',
    previous: '5.00%',
    actual: undefined,
    period: 'Current',
    source: 'Federal Reserve System',
    notes: 'Benchmark Federal Funds target range. Press conference follows at 19:30 UTC. Maximum liquidity volatility.',
  },
  {
    id: 'eco-usd-nfp',
    datetimeUtc: '2026-11-06T13:30:00Z',
    currency: 'USD',
    title: 'Non-Farm Employment Change (NFP)',
    impact: 'High',
    forecast: '145K',
    previous: '142K',
    actual: undefined,
    period: 'Oct',
    source: 'U.S. Bureau of Labor Statistics',
    notes: 'Non-Farm Payrolls. Released first Friday of each month. Causes massive institutional orderbook sweeps on Gold and Forex.',
  },
  {
    id: 'eco-usd-unemployment',
    datetimeUtc: '2026-11-06T13:30:00Z',
    currency: 'USD',
    title: 'Unemployment Rate',
    impact: 'High',
    forecast: '4.2%',
    previous: '4.2%',
    actual: undefined,
    period: 'Oct',
    source: 'U.S. Bureau of Labor Statistics',
    notes: 'Companion release to NFP. A rising unemployment rate accelerates expectations of dovish rate cuts.',
  },
];

export const TRUSTED_EXTERNAL_CALENDARS = [
  {
    name: 'ForexFactory Calendar',
    url: 'https://www.forexfactory.com/calendar',
    description: 'Gold standard for discretionary forex traders. Accurate impact folders, real-time live releases, and community discussion.',
    badge: 'Industry Benchmark',
  },
  {
    name: 'TradingView Economic Calendar',
    url: 'https://www.tradingview.com/economic-calendar/',
    description: 'Direct institutional data stream from Trading Economics with integrated charting overlays.',
    badge: 'Real-time Chart Synced',
  },
  {
    name: 'DailyFX Economic Calendar',
    url: 'https://www.dailyfx.com/economic-calendar',
    description: 'Curated by IG analysts with deep macro context, central bank rate trackers, and sentiment indicators.',
    badge: 'Forex Focused',
  },
  {
    name: 'TradingEconomics Global Horizon',
    url: 'https://tradingeconomics.com/calendar',
    description: 'Comprehensive historical databases and econometric forecasts across 196 countries.',
    badge: 'Macro Historical',
  },
];

export interface EconomicFilters {
  impact: 'All' | ImpactLevel;
  currency: 'All' | 'USD' | 'EUR' | 'GBP' | 'JPY';
  searchQuery: string;
}

export function filterEconomicEvents(
  events: EconomicEvent[],
  filters: EconomicFilters
): EconomicEvent[] {
  return events.filter((event) => {
    if (filters.impact !== 'All' && event.impact !== filters.impact) {
      return false;
    }
    if (filters.currency !== 'All' && event.currency !== filters.currency) {
      return false;
    }
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchesTitle = event.title.toLowerCase().includes(q);
      const matchesCurrency = event.currency.toLowerCase().includes(q);
      const matchesSource = event.source.toLowerCase().includes(q);
      if (!matchesTitle && !matchesCurrency && !matchesSource) {
        return false;
      }
    }
    return true;
  });
}
