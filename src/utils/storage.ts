import {
  AppDataBackup,
  ChartingAnalysis,
  PremarketSnapshot,
  PremarketStep,
  SanctuarySession,
  ThemeMode,
  TradeEntry,
  TradingRule,
} from '../types';

import {
  DEFAULT_TIMEZONE,
  isValidTimezone,
  sanitizeTimezone,
  getTimezoneOffsetString,
  formatDateTime,
} from './timezone';

export const STORAGE_KEYS = {
  TRADES: 'edge_trader_trades_v1',
  RULES: 'edge_trader_rules_v1',
  PREMARKET_ACTIVE: 'edge_trader_premarket_active_v1',
  PREMARKET_DATE: 'edge_trader_premarket_date_v1',
  PREMARKET_NOTES: 'edge_trader_premarket_notes_v1',
  PREMARKET_SNAPSHOTS: 'edge_trader_premarket_snapshots_v1',
  ANALYSES: 'edge_trader_analyses_v1',
  BALANCE: 'edge_trader_balance_v1',
  DEFAULT_RISK: 'edge_trader_default_risk_v1',
  TIMEZONE: 'edge_trader_timezone_v1',
  THEME: 'edge_trader_theme_v1',
  SANCTUARY_SESSIONS: 'edge_trader_sanctuary_sessions_v1',
};

export const DEFAULT_PREMARKET_STEPS: PremarketStep[] = [
  {
    id: 'step-calendar',
    stepNumber: 1,
    title: 'Check economic calendar',
    description: 'Review upcoming high-impact economic releases, interest rate events, and currency risk windows.',
    actionLabel: 'Open Calendar',
    actionPage: 'calendar',
  },
  {
    id: 'step-plan',
    stepNumber: 2,
    title: 'Review trading plan',
    description: 'Verify market conditions align with your Triple Confluence framework, session timing, and cardinal rules.',
    actionLabel: 'Review Plan',
    actionPage: 'strategy',
  },
  {
    id: 'step-watchlist',
    stepNumber: 3,
    title: 'Analyze watchlist and select instrument of the day',
    description: 'Scan watchlist pairs on higher timeframes and establish the primary setup for today.',
    actionLabel: 'Open Charts',
    actionPage: 'charts',
  },
  {
    id: 'step-risk',
    stepNumber: 4,
    title: 'Define risk',
    description: 'Determine position size, verify maximum loss threshold (1-2%), and set invalidation stop loss.',
    actionLabel: 'Open Calculator',
    actionPage: 'calculator',
  },
  {
    id: 'step-meditation',
    stepNumber: 5,
    title: 'Meditation',
    description: 'Clear emotional tension, calm the nervous system, and achieve mental focus in the Sanctuary.',
    actionLabel: 'Enter Sanctuary',
    actionPage: 'sanctuary',
  },
];

export const DEFAULT_RULES: TradingRule[] = [
  {
    id: 'rule-1',
    text: 'Wait for price to reach a meaningful area of interest before looking for execution triggers.',
    category: 'Structure',
    isCore: true,
    isActive: true,
  },
  {
    id: 'rule-2',
    text: 'Identify the liquidity event or sweep. Do not trade before liquidity has been engineered or swept.',
    category: 'Structure',
    isCore: true,
    isActive: true,
  },
  {
    id: 'rule-3',
    text: 'Wait for a confirmed Market Structure Shift (MSS) with displacement before taking entry.',
    category: 'Execution',
    isCore: true,
    isActive: true,
  },
  {
    id: 'rule-4',
    text: 'Do not enter merely because price is approaching a level. Proximity is not confirmation.',
    category: 'Execution',
    isCore: true,
    isActive: true,
  },
  {
    id: 'rule-5',
    text: 'Do not anticipate confirmation because of fear of missing a move (FOMO). Be willing to miss the trade.',
    category: 'Psychology',
    isCore: true,
    isActive: true,
  },
  {
    id: 'rule-6',
    text: 'Define entry, stop loss, and take profit before placing any order in the market.',
    category: 'Risk',
    isCore: true,
    isActive: true,
  },
  {
    id: 'rule-7',
    text: 'Calculate position size strictly from the chosen risk percentage and stop distance. Never guess lot size.',
    category: 'Risk',
    isCore: true,
    isActive: true,
  },
  {
    id: 'rule-8',
    text: 'Respect the planned stop loss; never widen it simply to avoid taking a loss or being stopped out.',
    category: 'Risk',
    isCore: true,
    isActive: true,
  },
  {
    id: 'rule-9',
    text: 'Record the reason for every trade and record every rule violation in the Trade Journal.',
    category: 'Psychology',
    isCore: true,
    isActive: true,
  },
];

// Helper to safely read from localStorage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

// Helper to safely write to localStorage
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Get user trades (defaults to empty array per honest-statistics requirement)
export function getStoredTrades(): TradeEntry[] {
  return loadFromStorage<TradeEntry[]>(STORAGE_KEYS.TRADES, []);
}

export function saveStoredTrades(trades: TradeEntry[]): void {
  saveToStorage(STORAGE_KEYS.TRADES, trades);
}

// Rules
export function getStoredRules(): TradingRule[] {
  return loadFromStorage<TradingRule[]>(STORAGE_KEYS.RULES, DEFAULT_RULES);
}

export function saveStoredRules(rules: TradingRule[]): void {
  saveToStorage(STORAGE_KEYS.RULES, rules);
}

// Premarket Active steps
export function getActivePremarket(): { date: string; completed: string[]; notes: string } {
  const today = new Date().toISOString().split('T')[0];
  const savedDate = localStorage.getItem(STORAGE_KEYS.PREMARKET_DATE) || today;
  const completed = loadFromStorage<string[]>(STORAGE_KEYS.PREMARKET_ACTIVE, []);
  const notes = localStorage.getItem(STORAGE_KEYS.PREMARKET_NOTES) || '';
  return { date: savedDate, completed, notes };
}

export function saveActivePremarket(completed: string[], notes: string): void {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(STORAGE_KEYS.PREMARKET_DATE, today);
  saveToStorage(STORAGE_KEYS.PREMARKET_ACTIVE, completed);
  localStorage.setItem(STORAGE_KEYS.PREMARKET_NOTES, notes);
}

export function resetActivePremarket(): void {
  const today = new Date().toISOString().split('T')[0];
  localStorage.setItem(STORAGE_KEYS.PREMARKET_DATE, today);
  saveToStorage(STORAGE_KEYS.PREMARKET_ACTIVE, []);
  localStorage.setItem(STORAGE_KEYS.PREMARKET_NOTES, '');
}

// Premarket Snapshots
export function getStoredPremarketSnapshots(): PremarketSnapshot[] {
  return loadFromStorage<PremarketSnapshot[]>(STORAGE_KEYS.PREMARKET_SNAPSHOTS, []);
}

export function saveStoredPremarketSnapshots(snapshots: PremarketSnapshot[]): void {
  saveToStorage(STORAGE_KEYS.PREMARKET_SNAPSHOTS, snapshots);
}

// Charting Analyses
export function getStoredAnalyses(): ChartingAnalysis[] {
  return loadFromStorage<ChartingAnalysis[]>(STORAGE_KEYS.ANALYSES, []);
}

export function saveStoredAnalyses(analyses: ChartingAnalysis[]): void {
  saveToStorage(STORAGE_KEYS.ANALYSES, analyses);
}

// Balance and default risk
export function getStoredBalance(): number {
  return loadFromStorage<number>(STORAGE_KEYS.BALANCE, 10000);
}

export function saveStoredBalance(balance: number): void {
  saveToStorage(STORAGE_KEYS.BALANCE, balance);
}

export function getStoredDefaultRisk(): number {
  return loadFromStorage<number>(STORAGE_KEYS.DEFAULT_RISK, 1.0);
}

export function saveStoredDefaultRisk(risk: number): void {
  saveToStorage(STORAGE_KEYS.DEFAULT_RISK, risk);
}

// Timezone persistence with fallback validation
export function getStoredTimezone(): string {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.TIMEZONE);
    if (!item) return DEFAULT_TIMEZONE;
    // item might be raw string or JSON quoted string
    let parsed = item;
    try {
      parsed = JSON.parse(item);
    } catch {
      parsed = item;
    }
    return sanitizeTimezone(parsed);
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

export function saveStoredTimezone(timeZone: string): void {
  const safeTz = sanitizeTimezone(timeZone);
  try {
    localStorage.setItem(STORAGE_KEYS.TIMEZONE, JSON.stringify(safeTz));
  } catch (err) {
    console.error('Error saving timezone to localStorage:', err);
  }
}

// Sanctuary meditation & breathwork sessions
export function getStoredSanctuarySessions(): SanctuarySession[] {
  return loadFromStorage<SanctuarySession[]>(STORAGE_KEYS.SANCTUARY_SESSIONS, []);
}

export function saveStoredSanctuarySessions(sessions: SanctuarySession[]): void {
  saveToStorage(STORAGE_KEYS.SANCTUARY_SESSIONS, sessions);
}

// Appearance Theme (Light & Dark)
export function applyThemeToDOM(theme: ThemeMode): void {
  try {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      }
    }
  } catch (err) {
    console.error('Error applying theme to DOM:', err);
  }
}

export function getStoredTheme(): ThemeMode {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.THEME);
    if (!item) return 'dark';
    let parsed = item;
    try {
      parsed = JSON.parse(item);
    } catch {
      parsed = item;
    }
    return parsed === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function saveStoredTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
    applyThemeToDOM(theme);
  } catch (err) {
    console.error('Error saving theme to localStorage:', err);
  }
}

// Export Trades to CSV
export function exportTradesToCSV(trades: TradeEntry[], timeZone?: string): void {
  if (!trades || trades.length === 0) {
    alert('No trades to export yet. Log at least one trade in your journal first.');
    return;
  }

  const activeTz = timeZone || getStoredTimezone();
  const headers = [
    `Local Time (${getTimezoneOffsetString(activeTz)})`,
    'UTC Timestamp (ISO 8601)',
    'Instrument',
    'Direction',
    'Session',
    'Setup Type',
    'H4 Bias',
    'H1/M15 Context',
    'Liquidity Sweep',
    'M5 MSS Confirmed',
    'Entry Price',
    'Stop Loss Price',
    'Take Profit Price',
    'Planned Risk %',
    'Position Size (Lots)',
    'Realized P&L (USD)',
    'Outcome',
    'Emotional State',
    'Rule Followed',
    'Lessons & Notes',
    'Screenshot URL',
  ];

  const escapeCSV = (val: unknown): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = trades.map((t) => [
    escapeCSV(formatDateTime(t.dateTime || t.createdAt, activeTz, true)),
    escapeCSV(t.dateTime || t.createdAt),
    escapeCSV(t.instrument),
    escapeCSV(t.direction),
    escapeCSV(t.session),
    escapeCSV(t.setupType),
    escapeCSV(t.h4Bias),
    escapeCSV(t.h1M15Context),
    escapeCSV(t.liquiditySweep ? 'Yes' : 'No'),
    escapeCSV(t.m5MssConfirmed ? 'Yes' : 'No'),
    escapeCSV(t.entryPrice),
    escapeCSV(t.stopLossPrice),
    escapeCSV(t.takeProfitPrice),
    escapeCSV(t.plannedRiskPct),
    escapeCSV(t.positionSize),
    escapeCSV(t.realizedPnL !== null ? t.realizedPnL : ''),
    escapeCSV(t.outcome),
    escapeCSV(t.emotionalState),
    escapeCSV(t.ruleFollowed ? 'Yes' : 'No'),
    escapeCSV(t.lessonsNotes),
    escapeCSV(t.screenshotUrl || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `edge_trader_journal_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export Full JSON Backup
export function exportFullBackupJSON(): void {
  const backup: AppDataBackup = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    trades: getStoredTrades(),
    premarketSnapshots: getStoredPremarketSnapshots(),
    activePremarketCompleted: loadFromStorage<string[]>(STORAGE_KEYS.PREMARKET_ACTIVE, []),
    premarketNotes: localStorage.getItem(STORAGE_KEYS.PREMARKET_NOTES) || '',
    rules: getStoredRules(),
    chartingAnalyses: getStoredAnalyses(),
    accountBalance: getStoredBalance(),
    defaultRiskPct: getStoredDefaultRisk(),
    timeZone: getStoredTimezone(),
    theme: getStoredTheme(),
    sanctuarySessions: getStoredSanctuarySessions(),
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `edge_trader_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Restore JSON backup
export function importBackupJSON(jsonString: string): { success: boolean; message: string; data?: AppDataBackup } {
  try {
    const data = JSON.parse(jsonString) as AppDataBackup;
    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Invalid JSON file structure.' };
    }

    if (Array.isArray(data.trades)) {
      saveStoredTrades(data.trades);
    }
    if (Array.isArray(data.rules)) {
      saveStoredRules(data.rules);
    }
    if (Array.isArray(data.premarketSnapshots)) {
      saveStoredPremarketSnapshots(data.premarketSnapshots);
    }
    if (Array.isArray(data.chartingAnalyses)) {
      saveStoredAnalyses(data.chartingAnalyses);
    }
    if (Array.isArray(data.activePremarketCompleted)) {
      saveToStorage(STORAGE_KEYS.PREMARKET_ACTIVE, data.activePremarketCompleted);
    }
    if (typeof data.premarketNotes === 'string') {
      localStorage.setItem(STORAGE_KEYS.PREMARKET_NOTES, data.premarketNotes);
    }
    if (typeof data.accountBalance === 'number') {
      saveStoredBalance(data.accountBalance);
    }
    if (typeof data.defaultRiskPct === 'number') {
      saveStoredDefaultRisk(data.defaultRiskPct);
    }
    if (typeof data.timeZone === 'string' && isValidTimezone(data.timeZone)) {
      saveStoredTimezone(data.timeZone);
    }
    if (data.theme === 'light' || data.theme === 'dark') {
      saveStoredTheme(data.theme);
    }
    if (Array.isArray(data.sanctuarySessions)) {
      saveStoredSanctuarySessions(data.sanctuarySessions);
    }

    return {
      success: true,
      message: `Restored successfully: ${data.trades?.length || 0} trades, ${data.chartingAnalyses?.length || 0} analyses, and ${data.rules?.length || 0} rules.`,
      data,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown parsing error';
    return { success: false, message: `Failed to parse JSON backup: ${msg}` };
  }
}

// Clear all data with explicit confirmation
export function clearAllAppData(): void {
  localStorage.removeItem(STORAGE_KEYS.TRADES);
  localStorage.removeItem(STORAGE_KEYS.RULES);
  localStorage.removeItem(STORAGE_KEYS.PREMARKET_ACTIVE);
  localStorage.removeItem(STORAGE_KEYS.PREMARKET_DATE);
  localStorage.removeItem(STORAGE_KEYS.PREMARKET_NOTES);
  localStorage.removeItem(STORAGE_KEYS.PREMARKET_SNAPSHOTS);
  localStorage.removeItem(STORAGE_KEYS.ANALYSES);
  localStorage.removeItem(STORAGE_KEYS.BALANCE);
  localStorage.removeItem(STORAGE_KEYS.DEFAULT_RISK);
  localStorage.removeItem(STORAGE_KEYS.TIMEZONE);
  localStorage.removeItem(STORAGE_KEYS.SANCTUARY_SESSIONS);
}
