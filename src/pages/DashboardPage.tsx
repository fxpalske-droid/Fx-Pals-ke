import React from 'react';
import {
  TrendingUp,
  LineChart,
  ListCheck,
  PlusCircle,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Target,
  Percent,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { TradeEntry } from '../types';
import { NavPage } from '../components/layout/Sidebar';
import { formatDateDisplay, formatCompactDateTime } from '../utils/timezone';
import { TabAccentColor, getTabColorConfig } from '../utils/theme';

interface DashboardPageProps {
  trades: TradeEntry[];
  premarketCompletedCount: number;
  totalPremarketSteps: number;
  timeZone: string;
  onNavigate: (page: NavPage) => void;
  onOpenNewTrade: () => void;
  onSelectTrade: (trade: TradeEntry) => void;
  tabColor?: TabAccentColor;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  trades,
  premarketCompletedCount,
  totalPremarketSteps,
  timeZone,
  onNavigate,
  onOpenNewTrade,
  onSelectTrade,
  tabColor = 'pink',
}) => {
  const colorConfig = getTabColorConfig(tabColor);
  const currentDate = formatDateDisplay(new Date(), timeZone);

  // Calculate honest statistics derived strictly from stored trades
  const totalRecorded = trades.length;
  const closedTrades = trades.filter((t) => t.outcome !== 'Open');
  const wins = closedTrades.filter((t) => t.outcome === 'Win').length;
  const losses = closedTrades.filter((t) => t.outcome === 'Loss').length;
  const breakevens = closedTrades.filter((t) => t.outcome === 'Breakeven').length;
  const openTrades = trades.filter((t) => t.outcome === 'Open').length;

  const winRate =
    closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(1) : null;

  // Realized net P&L from trades that have realized P&L recorded
  const tradesWithPnL = trades.filter((t) => t.realizedPnL !== null);
  const netRecordedPnL =
    tradesWithPnL.length > 0
      ? tradesWithPnL.reduce((sum, t) => sum + (t.realizedPnL || 0), 0)
      : null;

  const premarketProgressPct = Math.round(
    (premarketCompletedCount / totalPremarketSteps) * 100
  );

  const recentTrades = [...trades]
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-[#10141c] border border-[#c7c7c7] rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mb-1">
            <Calendar className={`w-3.5 h-3.5 ${colorConfig.textAccent}`} />
            <span>{currentDate}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Trade with structure. Execute with patience.
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            SMC structural context · Clean price action execution · London–New York session focus.
          </p>
        </div>

        {/* Quick Access Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('charts')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-200 bg-[#ffffff] hover:bg-[#202735] border border-[#262f3f] rounded-md transition-colors"
          >
            <LineChart className={`w-4 h-4 ${colorConfig.textAccent}`} />
            <span>Open Charts</span>
          </button>

          <button
            onClick={() => onNavigate('calendar')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-200 bg-[#ffffff] hover:bg-[#202735] border border-[#262f3f] rounded-md transition-colors"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => onNavigate('sanctuary')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-200 bg-[#ffffff] hover:bg-[#202735] border border-[#262f3f] rounded-md transition-colors"
          >
            <Sparkles className={`w-4 h-4 ${colorConfig.textAccent}`} />
            <span>Sanctuary</span>
          </button>

          <button
            onClick={() => onNavigate('premarket')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-200 bg-[#fffcfc] hover:bg-[#202735] border border-[#262f3f] rounded-md transition-colors"
          >
            <ListCheck className={`w-4 h-4 ${colorConfig.textAccent}`} />
            <span>Premarket ({premarketCompletedCount}/{totalPremarketSteps})</span>
          </button>

          <button
            onClick={onOpenNewTrade}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors shadow-xs ${colorConfig.primaryBtn}`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Trade</span>
          </button>
        </div>
      </div>

      {/* Discipline Banner */}
      <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg p-3.5 px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono text-gray-300">
            DISCIPLINE MANDATE:{' '}
            <strong className="text-white font-semibold">
              &ldquo;No confirmation, no entry.&rdquo;
            </strong>
          </span>
        </div>
        <button
          onClick={() => onNavigate('rules')}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 shrink-0"
        >
          <span>View Rules</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Performance Statistics Grid - Calculated strictly from saved records */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
            Journal Verified Performance Metrics
          </h3>
          <span className="text-[11px] text-gray-400 font-mono">
            {totalRecorded} total logged {totalRecorded === 1 ? 'trade' : 'trades'}
          </span>
        </div>

        {totalRecorded === 0 ? (
          // Honest empty state: no mock balances or fake results!
          <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-8 text-center space-y-3">
            <Target className="w-8 h-8 text-gray-400 mx-auto" />
            <h4 className="text-sm font-semibold text-white">No Trades Recorded Yet</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Performance statistics, win rate, and net P&L will be computed automatically from your
              actual recorded trades. Edge Trader never fabricates fake broker balances or simulated results.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenNewTrade}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log Your First Trade</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Total Trades */}
            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
                Total Trades
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono tabular-nums">
                  {totalRecorded}
                </span>
                {openTrades > 0 && (
                  <span className="text-[10px] text-sky-400 font-mono">
                    ({openTrades} open)
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">
                {closedTrades.length} settled outcomes
              </span>
            </div>

            {/* Wins & Losses */}
            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
                Win / Loss / BE
              </span>
              <div className="flex items-baseline gap-1.5 font-mono text-lg font-bold">
                <span className="text-emerald-400">{wins}W</span>
                <span className="text-gray-400">/</span>
                <span className="text-rose-400">{losses}L</span>
                <span className="text-gray-400">/</span>
                <span className="text-amber-400">{breakevens}BE</span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">
                Excludes active open trades
              </span>
            </div>

            {/* Win Rate */}
            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
                Win Rate
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                  {winRate !== null ? `${winRate}%` : 'N/A'}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">
                {closedTrades.length > 0
                  ? `${wins} wins of ${closedTrades.length} closed`
                  : 'Requires closed trades'}
              </span>
            </div>

            {/* Net Recorded P&L */}
            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
                Net Recorded P&L
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-bold font-mono tabular-nums ${
                    netRecordedPnL === null
                      ? 'text-gray-400'
                      : netRecordedPnL >= 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {netRecordedPnL !== null
                    ? `${netRecordedPnL >= 0 ? '+' : ''}$${netRecordedPnL.toFixed(2)}`
                    : 'N/A'}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">
                Actual realized returns logged
              </span>
            </div>

            {/* Discipline Score */}
            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4 col-span-2 lg:col-span-1">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
                Rule Adherence
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white font-mono tabular-nums">
                  {trades.length > 0
                    ? `${Math.round(
                        (trades.filter((t) => t.ruleFollowed).length / trades.length) * 100
                      )}%`
                    : '—'}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-1">
                {trades.filter((t) => t.ruleFollowed).length} of {trades.length} followed plan
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Premarket Checklist Status & Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Premarket Routine Card */}
        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ListCheck className={`w-4 h-4 ${colorConfig.textAccent}`} />
                <h3 className="text-sm font-semibold text-white">Today's Premarket Checklist</h3>
              </div>
              <span className={`text-xs font-mono font-bold ${colorConfig.textAccent}`}>
                {premarketProgressPct}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#1b2230] h-2 rounded-full overflow-hidden mb-3">
              <div
                className={`${colorConfig.progressFill} h-full transition-all duration-300`}
                style={{ width: `${premarketProgressPct}%` }}
              />
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              {premarketCompletedCount === totalPremarketSteps
                ? `All ${totalPremarketSteps} premarket routine steps completed for today. Prepared and centered.`
                : `${premarketCompletedCount} of ${totalPremarketSteps} steps confirmed today. Complete the 5-step checklist before taking setups.`}
            </p>
          </div>

          <div className="pt-3 border-t border-[#1b2230] flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-mono">
              Status:{' '}
              <strong
                className={
                  premarketCompletedCount === totalPremarketSteps
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }
              >
                {premarketCompletedCount === totalPremarketSteps ? 'Ready' : 'In Progress'}
              </strong>
            </span>

            <button
              onClick={() => onNavigate('premarket')}
              className={`text-xs ${colorConfig.textAccent} hover:opacity-80 font-medium flex items-center gap-1`}
            >
              <span>Open Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Trades Table */}
        <div className="lg:col-span-2 bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Journal Entries</h3>
            <button
              onClick={() => onNavigate('journal')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1"
            >
              <span>Full Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentTrades.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              No trade records yet. Click &quot;Record Trade&quot; to log your first setup.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-gray-400 uppercase font-mono border-b border-[#1b2230]">
                  <tr>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Pair</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2 text-right">Entry</th>
                    <th className="pb-2 text-right">Lots</th>
                    <th className="pb-2 text-center">Outcome</th>
                    <th className="pb-2 text-right">P&L ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181f2c]">
                  {recentTrades.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => onSelectTrade(t)}
                      className="hover:bg-[#161c27] cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 text-gray-400 font-mono">
                        {formatCompactDateTime(t.dateTime, timeZone)}
                      </td>
                      <td className="py-2.5 font-bold text-white font-mono">
                        {t.instrument}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded-xs font-semibold ${
                            t.direction === 'Buy'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {t.direction}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono text-gray-200">
                        {t.entryPrice}
                      </td>
                      <td className="py-2.5 text-right font-mono text-gray-300">
                        {t.positionSize}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-xs ${
                            t.outcome === 'Win'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : t.outcome === 'Loss'
                              ? 'text-rose-400 bg-rose-500/10'
                              : t.outcome === 'Breakeven'
                              ? 'text-amber-400 bg-amber-500/10'
                              : `${colorConfig.textAccent} ${colorConfig.bgSubtle}`
                          }`}
                        >
                          {t.outcome}
                        </span>
                      </td>
                      <td
                        className={`py-2.5 text-right font-mono tabular-nums font-semibold ${
                          t.realizedPnL === null
                            ? 'text-gray-400'
                            : t.realizedPnL > 0
                            ? 'text-emerald-400'
                            : t.realizedPnL < 0
                            ? 'text-rose-400'
                            : 'text-gray-300'
                        }`}
                      >
                        {t.realizedPnL !== null
                          ? `${t.realizedPnL >= 0 ? '+' : ''}$${t.realizedPnL.toFixed(2)}`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
