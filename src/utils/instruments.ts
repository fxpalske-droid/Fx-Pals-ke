import { InstrumentSpec } from '../types';

export const INSTRUMENT_SPECS: Record<string, InstrumentSpec> = {
  XAUUSD: {
    symbol: 'XAUUSD',
    name: 'Gold / US Dollar',
    category: 'Metals',
    contractSize: 100, // 100 troy ounces per 1.0 standard lot
    pipSize: 0.01, // 1 cent = 1 pip/point; $1 move = 100 pips = $100 per lot
    pipValuePerStandardLotUSD: 1.0, // $0.01 move on 100 oz = $1.00 USD
    priceDecimals: 2,
    tradingViewSymbol: 'OANDA:XAUUSD',
    notes: 'Standard 100 oz contract. $1.00 price change equals $100 per 1.00 standard lot ($1/pip on 0.01 lot).',
  },
  EURUSD: {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    category: 'Forex',
    contractSize: 100000,
    pipSize: 0.0001,
    pipValuePerStandardLotUSD: 10.0, // standard $10 per pip on 1.0 lot
    priceDecimals: 5,
    tradingViewSymbol: 'FX:EURUSD',
    notes: 'Standard 100k contract. 1 pip (0.0001) = $10.00 USD on 1.00 standard lot.',
  },
  GBPJPY: {
    symbol: 'GBPJPY',
    name: 'British Pound / Japanese Yen',
    category: 'Forex',
    contractSize: 100000,
    pipSize: 0.01,
    pipValuePerStandardLotUSD: 6.7, // approximate USD conversion for JPY pip (~1000 JPY / 150)
    priceDecimals: 3,
    tradingViewSymbol: 'FX:GBPJPY',
    notes: 'JPY cross. 1 pip (0.01) = 1,000 JPY per 1.00 lot (~$6.50–$7.00 depending on USDJPY exchange rate).',
  },
  GBPAUD: {
    symbol: 'GBPAUD',
    name: 'British Pound / Australian Dollar',
    category: 'Forex',
    contractSize: 100000,
    pipSize: 0.0001,
    pipValuePerStandardLotUSD: 6.5, // 10 AUD converted to USD (~0.65 AUD/USD)
    priceDecimals: 5,
    tradingViewSymbol: 'FX:GBPAUD',
    notes: 'AUD cross. 1 pip (0.0001) = 10 AUD per standard lot (~$6.50 USD depending on AUDUSD rate).',
  },
  USDJPY: {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    category: 'Forex',
    contractSize: 100000,
    pipSize: 0.01,
    pipValuePerStandardLotUSD: 6.7, // 1000 JPY / rate (~150)
    priceDecimals: 3,
    tradingViewSymbol: 'FX:USDJPY',
    notes: 'JPY pair. 1 pip (0.01) = 1,000 JPY per standard lot (~$6.67 USD at 150 rate).',
  },
  US30: {
    symbol: 'US30',
    name: 'Wall Street 30 / Dow Jones Index',
    category: 'Indices',
    contractSize: 1, // 1 index point
    pipSize: 1.0, // 1 whole index point
    pipValuePerStandardLotUSD: 1.0, // Typical retail CFD: 1 lot = $1/point (or $5 on some brokers)
    priceDecimals: 1,
    tradingViewSymbol: 'TVC:US30',
    notes: 'CFD contract. Retail brokers typically set 1.0 lot = $1.00 or $5.00 per 1 index point. Defaulted to $1.00/point.',
  },
};

export const DEFAULT_INSTRUMENT_LIST = ['XAUUSD', 'EURUSD', 'GBPJPY', 'GBPAUD', 'USDJPY', 'US30'];
