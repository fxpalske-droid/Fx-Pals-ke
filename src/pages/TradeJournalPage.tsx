import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  Eye,
  ArrowUpDown,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { TradeEntry, TradeOutcome, TradeDirection, TradingSession } from '../types';
import { exportTradesToCSV } from '../utils/storage';
import { DEFAULT_INSTRUMENT_LIST } from '../utils/instruments';
import { formatDateTime, getTimezoneOffsetString } from '../utils/timezone';

interface TradeJournalPageProps {
  trades: TradeEntry[];
  timeZone: string;
  onOpenNewTrade: () => void;
  onEditTrade: (trade: TradeEntry) => void;
  onViewTrade: (trade: TradeEntry) => void;
  onRequestDelete: (trade: TradeEntry) => void;
}

export const TradeJournalPage: React.FC<TradeJournalPageProps> = ({
  trades,
  timeZone,
  onOpenNewTrade,
  onEditTrade,
  onViewTrade,
  onRequestDelete,
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInstrument, setFilterInstrument] = useState<string>('ALL');
  const [filterDirection, setFilterDirection] = useState<string>('ALL');
  const [filterOutcome, setFilterOutcome] = useState<string>('ALL');
  const [filterSession, setFilterSession] = useState<string>('ALL');
  const [filterRule, setFilterRule] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'dateDesc' | 'dateAsc' | 'pnlHigh' | 'pnlLow'>('dateDesc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filter & Sort trades
  const filteredTrades = useMemo(() => {
    return trades
      .filter((trade) => {
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchInstrument = trade.instrument.toLowerCase().includes(query);
          const matchSetup = trade.setupType?.toLowerCase().includes(query);
          const matchNotes = trade.lessonsNotes?.toLowerCase().includes(query);
          const matchContext = trade.h1M15Context?.toLowerCase().includes(query);
          if (!matchInstrument && !matchSetup && !matchNotes && !matchContext) return false;
        }

        // Instrument filter
        if (filterInstrument !== 'ALL' && trade.instrument !== filterInstrument) return false;

        // Direction filter
        if (filterDirection !== 'ALL' && trade.direction !== filterDirection) return false;

        // Outcome filter
        if (filterOutcome !== 'ALL' && trade.outcome !== filterOutcome) return false;

        // Session filter
        if (filterSession !== 'ALL' && trade.session !== filterSession) return false;

        // Rule followed filter
        if (filterRule === 'YES' && !trade.ruleFollowed) return false;
        if (filterRule === 'NO' && trade.ruleFollowed) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dateDesc') {
          return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
        }
        if (sortBy === 'dateAsc') {
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        }
        if (sortBy === 'pnlHigh') {
          return (b.realizedPnL ?? -999999) - (a.realizedPnL ?? -999999);
        }
        if (sortBy === 'pnlLow') {
          return (a.realizedPnL ?? 999999) - (b.realizedPnL ?? 999999);
        }
        return 0;
      });
  }, [
    trades,
    searchQuery,
    filterInstrument,
    filterDirection,
    filterOutcome,
    filterSession,
    filterRule,
    sortBy,
  ]);

  // Derived Performance Metrics strictly from saved data
  const totalTrades = trades.length;
  const closedTrades = trades.filter((t) => t.outcome !== 'Open');
  const wins = closedTrades.filter((t) => t.outcome === 'Win');
  const losses = closedTrades.filter((t) => t.outcome === 'Loss');
  const winCount = wins.length;
  const lossCount = losses.length;

  const winRate =
    closedTrades.length > 0 ? ((winCount / closedTrades.length) * 100).toFixed(1) : null;

  const netPnL = trades.reduce(
    (sum, t) => (t.realizedPnL !== null ? sum + t.realizedPnL : sum),
    0
  );

  const totalGrossWin = wins.reduce(
    (sum, t) => (t.realizedPnL && t.realizedPnL > 0 ? sum + t.realizedPnL : sum),
    0
  );
  const totalGrossLoss = Math.abs(
    losses.reduce(
      (sum, t) => (t.realizedPnL && t.realizedPnL < 0 ? sum + t.realizedPnL : sum),
      0
    )
  );

  const profitFactor =
    totalGrossLoss > 0
      ? (totalGrossWin / totalGrossLoss).toFixed(2)
      : totalGrossWin > 0
      ? '∞'
      : 'N/A';

  const avgWin = winCount > 0 ? (totalGrossWin / winCount).toFixed(2) : null;
  const avgLoss = lossCount > 0 ? (totalGrossLoss / lossCount).toFixed(2) : null;

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTrades.length / pageSize));
  const paginatedTrades = filteredTrades.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <BookOpen className="w-4 h-4" />
            <span>DISCRETIONARY PERFORMANCE LOG</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Trade Journal & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Manual execution archive. Realized returns and planned risk are strictly decoupled.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportTradesToCSV(trades, timeZone)}
            disabled={trades.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white bg-[#171c26] hover:bg-[#202735] border border-[#262f3f] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5 text-gray-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewTrade}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Record Trade</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-3.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
            Total Trades
          </span>
          <span className="text-xl font-bold text-white font-mono tabular-nums">
            {totalTrades}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            {closedTrades.length} settled
          </span>
        </div>

        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-3.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
            Win Rate
          </span>
          <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
            {winRate !== null ? `${winRate}%` : 'N/A'}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">
            {winCount}W / {lossCount}L
          </span>
        </div>

        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-3.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
            Net Realized P&L
          </span>
          <span
            className={`text-xl font-bold font-mono tabular-nums ${
              closedTrades.length === 0
                ? 'text-gray-400'
                : netPnL >= 0
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}
          >
            {closedTrades.length > 0 ? `${netPnL >= 0 ? '+' : ''}$${netPnL.toFixed(2)}` : 'N/A'}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">USD actual return</span>
        </div>

        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-3.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
            Profit Factor
          </span>
          <span className="text-xl font-bold text-white font-mono tabular-nums">
            {profitFactor}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Win/Loss Ratio</span>
        </div>

        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-3.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
            Avg Win
          </span>
          <span className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
            {avgWin ? `+$${avgWin}` : '—'}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Per winning trade</span>
        </div>

        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-3.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-1">
            Avg Loss
          </span>
          <span className="text-xl font-bold text-rose-400 font-mono tabular-nums">
            {avgLoss ? `-$${avgLoss}` : '—'}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Per stopped trade</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by pair, setup, notes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#161c26] border border-[#232b3b] rounded-md pl-8 pr-3 py-1.5 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Instrument filter */}
          <div>
            <select
              value={filterInstrument}
              onChange={(e) => {
                setFilterInstrument(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">All Pairs</option>
              {DEFAULT_INSTRUMENT_LIST.map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          </div>

          {/* Direction filter */}
          <div>
            <select
              value={filterDirection}
              onChange={(e) => {
                setFilterDirection(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">All Directions</option>
              <option value="Buy">Buy (Long)</option>
              <option value="Sell">Sell (Short)</option>
            </select>
          </div>

          {/* Outcome filter */}
          <div>
            <select
              value={filterOutcome}
              onChange={(e) => {
                setFilterOutcome(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">All Outcomes</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="Breakeven">Breakeven</option>
              <option value="Open">Open</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-hidden font-mono"
            >
              <option value="dateDesc">Date (Newest)</option>
              <option value="dateAsc">Date (Oldest)</option>
              <option value="pnlHigh">P&L (Highest)</option>
              <option value="pnlLow">P&L (Lowest)</option>
            </select>
          </div>
        </div>

        {/* Secondary row of quick tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1a202d] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono text-[11px]">Session:</span>
            {['ALL', 'London-NY Overlap', 'London', 'New York', 'Asian'].map((sess) => (
              <button
                key={sess}
                onClick={() => {
                  setFilterSession(sess);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded-xs font-mono text-[11px] transition-colors ${
                  filterSession === sess
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-gray-400 hover:text-white bg-[#151923]'
                }`}
              >
                {sess === 'London-NY Overlap' ? 'Overlap' : sess}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono text-[11px]">Discipline:</span>
            <button
              onClick={() => {
                setFilterRule('ALL');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded-xs font-mono text-[11px] transition-colors ${
                filterRule === 'ALL'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white bg-[#151923]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilterRule('YES');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded-xs font-mono text-[11px] transition-colors ${
                filterRule === 'YES'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white bg-[#151923]'
              }`}
            >
              Rules Followed
            </button>
            <button
              onClick={() => {
                setFilterRule('NO');
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded-xs font-mono text-[11px] transition-colors ${
                filterRule === 'NO'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white bg-[#151923]'
              }`}
            >
              Rules Broken
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg overflow-hidden">
        {filteredTrades.length === 0 ? (
          <div className="text-center py-12 p-6 space-y-3">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto" />
            <h4 className="text-sm font-semibold text-white">No Matching Trade Records</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              {trades.length === 0
                ? 'Your journal is currently empty. Start logging your discretionary setups with full confluence verification.'
                : 'No trades match the active filters and search query.'}
            </p>
            {trades.length === 0 && (
              <button
                onClick={onOpenNewTrade}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Log First Trade</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0c0e14] text-[11px] text-gray-400 uppercase font-mono border-b border-[#1b2230]">
                <tr>
                  <th className="py-3 px-4">Date / Time ({getTimezoneOffsetString(timeZone)})</th>
                  <th className="py-3 px-3">Pair</th>
                  <th className="py-3 px-2">Dir</th>
                  <th className="py-3 px-3">Session</th>
                  <th className="py-3 px-3 text-right">Entry</th>
                  <th className="py-3 px-3 text-right">SL</th>
                  <th className="py-3 px-3 text-right">TP</th>
                  <th className="py-3 px-2 text-right">Lots</th>
                  <th className="py-3 px-2 text-center">Sweep</th>
                  <th className="py-3 px-2 text-center">MSS</th>
                  <th className="py-3 px-3 text-center">Outcome</th>
                  <th className="py-3 px-4 text-right">Realized P&L</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181f2c]">
                {paginatedTrades.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-[#141924] transition-colors cursor-pointer group"
                    onClick={() => onViewTrade(t)}
                  >
                    <td className="py-3 px-4 text-gray-300 font-mono whitespace-nowrap">
                      {formatDateTime(t.dateTime, timeZone)}
                    </td>

                    <td className="py-3 px-3 font-bold text-white font-mono whitespace-nowrap">
                      {t.instrument}
                    </td>

                    <td className="py-3 px-2 whitespace-nowrap">
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded-xs font-bold ${
                          t.direction === 'Buy'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-rose-400 bg-rose-500/10'
                        }`}
                      >
                        {t.direction}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-gray-300 whitespace-nowrap">
                      {t.session}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-gray-200 tabular-nums">
                      {t.entryPrice}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-rose-400 tabular-nums">
                      {t.stopLossPrice}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-emerald-400 tabular-nums">
                      {t.takeProfitPrice || '—'}
                    </td>

                    <td className="py-3 px-2 text-right font-mono text-gray-300 tabular-nums">
                      {t.positionSize}
                    </td>

                    <td className="py-3 px-2 text-center">
                      {t.liquiditySweep ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-gray-400 font-mono">—</span>
                      )}
                    </td>

                    <td className="py-3 px-2 text-center">
                      {t.m5MssConfirmed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="text-gray-400 font-mono">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-xs font-mono ${
                          t.outcome === 'Win'
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                            : t.outcome === 'Loss'
                            ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                            : t.outcome === 'Breakeven'
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                            : 'text-sky-400 bg-sky-500/10 border border-sky-500/20'
                        }`}
                      >
                        {t.outcome}
                      </span>
                    </td>

                    <td
                      className={`py-3 px-4 text-right font-mono tabular-nums font-bold whitespace-nowrap ${
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
                        : 'Open'}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewTrade(t)}
                          className="p-1 text-gray-400 hover:text-white hover:bg-[#1f2635] rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditTrade(t)}
                          className="p-1 text-gray-400 hover:text-white hover:bg-[#1f2635] rounded-md transition-colors"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRequestDelete(t)}
                          className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-[#1b2230] flex items-center justify-between text-xs text-gray-400">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredTrades.length)} of {filteredTrades.length} trades
            </span>

            <div className="flex items-center gap-1 font-mono">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-md bg-[#161c26] text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
              >
                Prev
              </button>
              <span className="px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-md bg-[#161c26] text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
