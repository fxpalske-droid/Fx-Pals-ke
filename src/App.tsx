import React, { useState, useEffect } from 'react';
import { Sidebar, NavPage } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { TradeModal } from './components/journal/TradeModal';
import { TradeDetailModal } from './components/journal/TradeDetailModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LiveChartsPage } from './pages/LiveChartsPage';
import { EconomicCalendarPage } from './pages/EconomicCalendarPage';
import { SanctuaryPage } from './pages/SanctuaryPage';
import { StrategyPage } from './pages/StrategyPage';
import { TradingRulesPage } from './pages/TradingRulesPage';
import { PremarketRoutinePage } from './pages/PremarketRoutinePage';
import { TradeJournalPage } from './pages/TradeJournalPage';
import { ChartingProcessPage } from './pages/ChartingProcessPage';
import { RiskCalculatorPage } from './pages/RiskCalculatorPage';
import { SettingsPage } from './pages/SettingsPage';

// Types & storage utilities
import {
  TradeEntry,
  TradingRule,
  PremarketSnapshot,
  ChartingAnalysis,
  TradeDirection,
  SanctuarySession,
  ThemeMode,
} from './types';
import {
  getStoredTrades,
  saveStoredTrades,
  getStoredRules,
  saveStoredRules,
  getActivePremarket,
  saveActivePremarket,
  resetActivePremarket,
  getStoredPremarketSnapshots,
  saveStoredPremarketSnapshots,
  getStoredAnalyses,
  saveStoredAnalyses,
  getStoredBalance,
  saveStoredBalance,
  getStoredDefaultRisk,
  saveStoredDefaultRisk,
  getStoredTimezone,
  saveStoredTimezone,
  getStoredSanctuarySessions,
  saveStoredSanctuarySessions,
  getStoredTheme,
  saveStoredTheme,
  applyThemeToDOM,
  clearAllAppData,
  DEFAULT_RULES,
  DEFAULT_PREMARKET_STEPS,
} from './utils/storage';
import { DEFAULT_TIMEZONE, formatDateTime } from './utils/timezone';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App persistent state
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [rules, setRules] = useState<TradingRule[]>(DEFAULT_RULES);
  const [premarketCompleted, setPremarketCompleted] = useState<string[]>([]);
  const [premarketNotes, setPremarketNotes] = useState<string>('');
  const [premarketSnapshots, setPremarketSnapshots] = useState<PremarketSnapshot[]>([]);
  const [analyses, setAnalyses] = useState<ChartingAnalysis[]>([]);
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [defaultRiskPct, setDefaultRiskPct] = useState<number>(1.0);
  const [timeZone, setTimeZone] = useState<string>(DEFAULT_TIMEZONE);
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());
  const [sanctuarySessions, setSanctuarySessions] = useState<SanctuarySession[]>([]);

  // Apply theme immediately to DOM on mount and whenever theme changes
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const handleUpdateTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    saveStoredTheme(newTheme);
  };

  // Trade Modal state
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<TradeEntry | null>(null);
  const [tradeInitialValues, setTradeInitialValues] = useState<Partial<TradeEntry> | undefined>(
    undefined
  );
  const [tradeToView, setTradeToView] = useState<TradeEntry | null>(null);

  // Delete trade confirmation
  const [tradeToDelete, setTradeToDelete] = useState<TradeEntry | null>(null);

  // Clear all data confirmation
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Initial load from localStorage
  useEffect(() => {
    setTrades(getStoredTrades());
    setRules(getStoredRules());
    const activePm = getActivePremarket();
    setPremarketCompleted(activePm.completed);
    setPremarketNotes(activePm.notes);
    setPremarketSnapshots(getStoredPremarketSnapshots());
    setAnalyses(getStoredAnalyses());
    setAccountBalance(getStoredBalance());
    setDefaultRiskPct(getStoredDefaultRisk());
    setTimeZone(getStoredTimezone());
    setSanctuarySessions(getStoredSanctuarySessions());
  }, []);

  // Handlers for Trades
  const handleSaveTrade = (savedTrade: TradeEntry) => {
    let updated: TradeEntry[];
    const exists = trades.some((t) => t.id === savedTrade.id);
    if (exists) {
      updated = trades.map((t) => (t.id === savedTrade.id ? savedTrade : t));
    } else {
      updated = [savedTrade, ...trades];
    }
    setTrades(updated);
    saveStoredTrades(updated);
    if (tradeToView && tradeToView.id === savedTrade.id) {
      setTradeToView(savedTrade);
    }
  };

  const handleConfirmDeleteTrade = () => {
    if (!tradeToDelete) return;
    const updated = trades.filter((t) => t.id !== tradeToDelete.id);
    setTrades(updated);
    saveStoredTrades(updated);
    if (tradeToView && tradeToView.id === tradeToDelete.id) {
      setTradeToView(null);
    }
    setTradeToDelete(null);
  };

  const handleOpenNewTrade = () => {
    setTradeToEdit(null);
    setTradeInitialValues(undefined);
    setIsTradeModalOpen(true);
  };

  const handleEditTrade = (trade: TradeEntry) => {
    setTradeToEdit(trade);
    setTradeInitialValues(undefined);
    setIsTradeModalOpen(true);
  };

  // Handlers for Rules
  const handleUpdateRules = (newRules: TradingRule[]) => {
    setRules(newRules);
    saveStoredRules(newRules);
  };

  // Handlers for Premarket
  const handleTogglePremarketStep = (stepId: string) => {
    const updated = premarketCompleted.includes(stepId)
      ? premarketCompleted.filter((id) => id !== stepId)
      : [...premarketCompleted, stepId];
    setPremarketCompleted(updated);
    saveActivePremarket(updated, premarketNotes);
  };

  const handleUpdatePremarketNotes = (newNotes: string) => {
    setPremarketNotes(newNotes);
    saveActivePremarket(premarketCompleted, newNotes);
  };

  const handleResetPremarketToday = () => {
    resetActivePremarket();
    setPremarketCompleted([]);
    setPremarketNotes('');
  };

  const handleSavePremarketSnapshot = (snapshot: PremarketSnapshot) => {
    const updated = [snapshot, ...premarketSnapshots];
    setPremarketSnapshots(updated);
    saveStoredPremarketSnapshots(updated);
  };

  const handleDeletePremarketSnapshot = (id: string) => {
    const updated = premarketSnapshots.filter((s) => s.id !== id);
    setPremarketSnapshots(updated);
    saveStoredPremarketSnapshots(updated);
  };

  // Handlers for Charting Analyses
  const handleSaveAnalysis = (analysis: ChartingAnalysis) => {
    let updated: ChartingAnalysis[];
    const exists = analyses.some((a) => a.id === analysis.id);
    if (exists) {
      updated = analyses.map((a) => (a.id === analysis.id ? analysis : a));
    } else {
      updated = [analysis, ...analyses];
    }
    setAnalyses(updated);
    saveStoredAnalyses(updated);
  };

  const handleDeleteAnalysis = (id: string) => {
    const updated = analyses.filter((a) => a.id !== id);
    setAnalyses(updated);
    saveStoredAnalyses(updated);
  };

  // Balance & Risk settings
  const handleUpdateBalance = (bal: number) => {
    setAccountBalance(bal);
    saveStoredBalance(bal);
  };

  const handleUpdateRisk = (risk: number) => {
    setDefaultRiskPct(risk);
    saveStoredDefaultRisk(risk);
  };

  // Transfer from Calculator to Journal
  const handleTransferToJournal = (params: {
    instrument: string;
    direction: TradeDirection;
    entryPrice: number;
    stopLossPrice: number;
    takeProfitPrice: number;
    plannedRiskPct: number;
    positionSize: number;
  }) => {
    setTradeToEdit(null);
    setTradeInitialValues({
      instrument: params.instrument,
      direction: params.direction,
      entryPrice: params.entryPrice,
      stopLossPrice: params.stopLossPrice,
      takeProfitPrice: params.takeProfitPrice,
      plannedRiskPct: params.plannedRiskPct,
      positionSize: params.positionSize,
      outcome: 'Open',
      realizedPnL: null,
    });
    setIsTradeModalOpen(true);
  };

  // Handle Restore
  const handleDataRestored = () => {
    setTrades(getStoredTrades());
    setRules(getStoredRules());
    const activePm = getActivePremarket();
    setPremarketCompleted(activePm.completed);
    setPremarketNotes(activePm.notes);
    setPremarketSnapshots(getStoredPremarketSnapshots());
    setAnalyses(getStoredAnalyses());
    setAccountBalance(getStoredBalance());
    setDefaultRiskPct(getStoredDefaultRisk());
    setTimeZone(getStoredTimezone());
    setTheme(getStoredTheme());
    setSanctuarySessions(getStoredSanctuarySessions());
  };

  const handleUpdateTimezone = (tz: string) => {
    setTimeZone(tz);
    saveStoredTimezone(tz);
  };

  // Handlers for Sanctuary Sessions
  const handleSaveSanctuarySession = (session: SanctuarySession) => {
    const updated = [session, ...sanctuarySessions];
    setSanctuarySessions(updated);
    saveStoredSanctuarySessions(updated);
  };

  const handleClearSanctuarySessions = () => {
    setSanctuarySessions([]);
    saveStoredSanctuarySessions([]);
  };

  const handleDeleteSanctuarySession = (sessionId: string) => {
    const updated = sanctuarySessions.filter((s) => s.id !== sessionId);
    setSanctuarySessions(updated);
    saveStoredSanctuarySessions(updated);
  };

  // Handle Clear All Data
  const handleConfirmClearAll = () => {
    clearAllAppData();
    setTrades([]);
    setRules(DEFAULT_RULES);
    setPremarketCompleted([]);
    setPremarketNotes('');
    setPremarketSnapshots([]);
    setAnalyses([]);
    setAccountBalance(10000);
    setDefaultRiskPct(1.0);
    setTimeZone(DEFAULT_TIMEZONE);
    setSanctuarySessions([]);
    setIsClearAllModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-gray-200 flex flex-col font-sans">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenNewTrade={handleOpenNewTrade}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          currentPage={currentPage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewTrade={handleOpenNewTrade}
          onSelectPage={setCurrentPage}
          timeZone={timeZone}
          theme={theme}
          onToggleTheme={() => handleUpdateTheme(theme === 'dark' ? 'light' : 'dark')}
        />

        {/* Dynamic Page Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto bg-[#ffffff]">
          {currentPage === 'dashboard' && (
            <DashboardPage
              trades={trades}
              premarketCompletedCount={premarketCompleted.length}
              totalPremarketSteps={DEFAULT_PREMARKET_STEPS.flatMap((s) => s.subItems).length}
              timeZone={timeZone}
              onNavigate={setCurrentPage}
              onOpenNewTrade={handleOpenNewTrade}
              onSelectTrade={(t) => setTradeToView(t)}
            />
          )}

          {currentPage === 'charts' && <LiveChartsPage theme={theme} />}

          {currentPage === 'calendar' && (
            <EconomicCalendarPage timeZone={timeZone} onNavigate={setCurrentPage} theme={theme} />
          )}

          {currentPage === 'premarket' && (
            <PremarketRoutinePage
              completedStepIds={premarketCompleted}
              notes={premarketNotes}
              snapshots={premarketSnapshots}
              timeZone={timeZone}
              onToggleStep={handleTogglePremarketStep}
              onUpdateNotes={handleUpdatePremarketNotes}
              onResetToday={handleResetPremarketToday}
              onSaveSnapshot={handleSavePremarketSnapshot}
              onDeleteSnapshot={handleDeletePremarketSnapshot}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'sanctuary' && (
            <SanctuaryPage
              timeZone={timeZone}
              onCompleteMeditation={() => {
                if (!premarketCompleted.includes('step-meditation')) {
                  handleTogglePremarketStep('step-meditation');
                }
              }}
              sessions={sanctuarySessions}
              onSaveSession={handleSaveSanctuarySession}
              onClearSessions={handleClearSanctuarySessions}
              onDeleteSession={handleDeleteSanctuarySession}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'strategy' && <StrategyPage />}

          {currentPage === 'rules' && (
            <TradingRulesPage rules={rules} onUpdateRules={handleUpdateRules} />
          )}

          {currentPage === 'journal' && (
            <TradeJournalPage
              trades={trades}
              timeZone={timeZone}
              onOpenNewTrade={handleOpenNewTrade}
              onEditTrade={handleEditTrade}
              onViewTrade={(t) => setTradeToView(t)}
              onRequestDelete={(t) => setTradeToDelete(t)}
            />
          )}

          {currentPage === 'charting' && (
            <ChartingProcessPage
              analyses={analyses}
              timeZone={timeZone}
              onSaveAnalysis={handleSaveAnalysis}
              onDeleteAnalysis={handleDeleteAnalysis}
            />
          )}

          {currentPage === 'calculator' && (
            <RiskCalculatorPage
              initialBalance={accountBalance}
              initialRiskPct={defaultRiskPct}
              onUpdateDefaultBalance={handleUpdateBalance}
              onUpdateDefaultRisk={handleUpdateRisk}
              onTransferToJournal={handleTransferToJournal}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              trades={trades}
              accountBalance={accountBalance}
              defaultRiskPct={defaultRiskPct}
              timeZone={timeZone}
              theme={theme}
              onUpdateBalance={handleUpdateBalance}
              onUpdateRisk={handleUpdateRisk}
              onUpdateTimezone={handleUpdateTimezone}
              onUpdateTheme={handleUpdateTheme}
              onDataRestored={handleDataRestored}
              onRequestClearAll={() => setIsClearAllModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Trade Create/Edit Modal */}
      <TradeModal
        isOpen={isTradeModalOpen}
        tradeToEdit={tradeToEdit}
        initialValues={tradeInitialValues}
        timeZone={timeZone}
        onClose={() => {
          setIsTradeModalOpen(false);
          setTradeToEdit(null);
          setTradeInitialValues(undefined);
        }}
        onSave={handleSaveTrade}
      />

      {/* Trade Detail Modal */}
      <TradeDetailModal
        trade={tradeToView}
        timeZone={timeZone}
        onClose={() => setTradeToView(null)}
        onEdit={(t) => {
          setTradeToView(null);
          handleEditTrade(t);
        }}
        onDelete={(t) => {
          setTradeToView(null);
          setTradeToDelete(t);
        }}
      />

      {/* Delete Trade Confirmation Modal */}
      <ConfirmationModal
        isOpen={tradeToDelete !== null}
        title="Delete Trade Record"
        message={`Are you sure you want to permanently delete the trade entry for ${tradeToDelete?.instrument} on ${tradeToDelete ? formatDateTime(tradeToDelete.dateTime, timeZone) : ''}? This action cannot be undone.`}
        confirmLabel="Delete Trade"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDeleteTrade}
        onCancel={() => setTradeToDelete(null)}
      />

      {/* Clear All Data Confirmation Modal */}
      <ConfirmationModal
        isOpen={isClearAllModalOpen}
        title="Clear All Workspace Data"
        message="Are you sure you want to permanently erase all saved trade journal records, premarket snapshots, charting notes, and custom rules? All local data will be reset to factory defaults."
        confirmLabel="Erase Everything"
        cancelLabel="Keep Data"
        isDestructive={true}
        onConfirm={handleConfirmClearAll}
        onCancel={() => setIsClearAllModalOpen(false)}
      />
    </div>
  );
}
