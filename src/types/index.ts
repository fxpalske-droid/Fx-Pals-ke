export type ThemeMode = 'dark' | 'light';

export type TradeOutcome = 'Win' | 'Loss' | 'Breakeven' | 'Open';
export type TradeDirection = 'Buy' | 'Sell';
export type TradingSession = 'London' | 'New York' | 'Asian' | 'London-NY Overlap';
export type EmotionalState =
  | 'Calm & Disciplined'
  | 'Patient'
  | 'Anxious'
  | 'FOMO'
  | 'Rushed'
  | 'Revenge'
  | 'Overconfident';

export interface TradeEntry {
  id: string;
  createdAt: string;
  dateTime: string;
  instrument: string;
  direction: TradeDirection;
  session: TradingSession;
  setupType: string;
  h4Bias: 'Bullish' | 'Bearish' | 'Neutral/Range';
  h1M15Context: string;
  liquiditySweep: boolean;
  m5MssConfirmed: boolean;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  plannedRiskPct: number;
  positionSize: number;
  realizedPnL: number | null; // USD amount, null when open
  outcome: TradeOutcome;
  screenshotUrl?: string;
  emotionalState: EmotionalState;
  ruleFollowed: boolean;
  lessonsNotes: string;
}

export interface PremarketSubItem {
  id: string;
  label: string;
  detail: string;
}

export interface PremarketStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  timeframe?: string;
  actionLabel?: string;
  actionPage?: 'calendar' | 'rules' | 'charts' | 'calculator' | 'sanctuary' | 'strategy';
  subItems?: PremarketSubItem[];
}

export interface PremarketSnapshot {
  id: string;
  date: string;
  savedAt: string;
  completedIds: string[];
  totalSteps: number;
  notes: string;
  readinessScore?: number;
}

export type ImpactLevel = 'High' | 'Medium' | 'Low';

export interface EconomicEvent {
  id: string;
  datetimeUtc: string; // ISO 8601 UTC string (e.g. 2026-10-20T12:30:00Z)
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF';
  title: string;
  impact: ImpactLevel;
  forecast?: string;
  previous?: string;
  actual?: string;
  period?: string;
  source: string;
  notes?: string;
}

export type BreathingPattern = 'box' | 'calm-478' | 'coherent-55' | 'tactical-sigh';

export interface SanctuarySession {
  id: string;
  completedAtUtc: string;
  durationSeconds: number;
  pattern: BreathingPattern;
  soundscapeUsed?: string;
  stateBefore?: string;
  stateAfter?: string;
  notes?: string;
}

export interface TradingRule {
  id: string;
  text: string;
  category: 'Structure' | 'Execution' | 'Risk' | 'Psychology';
  isCore: boolean;
  isActive: boolean;
}

export type FinalDecision = 'Wait' | 'Valid Setup' | 'No Trade';

export interface ChartingAnalysis {
  id: string;
  createdAt: string;
  title: string;
  instrument: string;
  h4Context: string;
  h1Structure: string;
  m15Aoi: string;
  liquidityPools: string;
  inducementHypothesis: string;
  m5Sweep: string;
  m5Mss: string;
  plannedEntry: string;
  plannedStop: string;
  plannedTarget: string;
  invalidationConditions: string;
  finalDecision: FinalDecision;
  notes: string;
}

export interface InstrumentSpec {
  symbol: string;
  name: string;
  category: 'Forex' | 'Metals' | 'Indices' | 'Custom';
  contractSize: number; // e.g. 100,000 for standard forex, 100 for XAUUSD (100 oz), 1 or 5 for US30
  pipSize: number; // e.g. 0.0001 for EURUSD, 0.01 for USDJPY, 0.01 for XAUUSD, 1.0 for US30
  pipValuePerStandardLotUSD: number; // Estimated USD value per pip/point on 1 standard lot
  priceDecimals: number;
  tradingViewSymbol: string;
  notes: string;
}

export interface CalculatorInputs {
  instrument: string;
  direction: TradeDirection;
  accountBalance: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  customContractSize?: number;
  customPipValue?: number;
}

export interface CalculatorResults {
  isValid: boolean;
  errorMessage?: string;
  dollarRisk: number;
  stopDistance: number;
  stopDistancePips: number;
  targetDistance: number;
  targetDistancePips: number;
  riskRewardRatio: number;
  suggestedLots: number;
  minLotConstraintApplied: boolean;
  estimatedLossUSD: number;
  estimatedProfitUSD: number;
  specUsed: InstrumentSpec;
}

export interface AppDataBackup {
  version: string;
  exportedAt: string;
  trades: TradeEntry[];
  premarketSnapshots: PremarketSnapshot[];
  activePremarketCompleted: string[];
  premarketNotes: string;
  rules: TradingRule[];
  chartingAnalyses: ChartingAnalysis[];
  accountBalance: number;
  defaultRiskPct: number;
  timeZone?: string;
  theme?: ThemeMode;
  sanctuarySessions?: SanctuarySession[];
}
