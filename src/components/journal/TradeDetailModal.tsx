import React from 'react';
import { X, ExternalLink, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { TradeEntry } from '../../types';
import { formatDateTime, getTimezoneOffsetString } from '../../utils/timezone';

interface TradeDetailModalProps {
  trade: TradeEntry | null;
  timeZone: string;
  onClose: () => void;
  onEdit: (trade: TradeEntry) => void;
  onDelete: (trade: TradeEntry) => void;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({
  trade,
  timeZone,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!trade) return null;

  const isProfitable = trade.realizedPnL !== null && trade.realizedPnL > 0;
  const isLoss = trade.realizedPnL !== null && trade.realizedPnL < 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#11151c] border border-[#232938] rounded-lg shadow-2xl text-gray-200 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f2635] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 text-xs font-bold rounded-xs font-mono uppercase ${
                trade.direction === 'Buy'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {trade.direction}
            </span>
            <h2 className="text-base font-bold text-white tracking-wide font-mono">
              {trade.instrument}
            </h2>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-300 font-mono">
              {formatDateTime(trade.dateTime, timeZone, true)} ({getTimezoneOffsetString(timeZone)})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(trade);
              }}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1a202d] rounded-md transition-colors"
              title="Edit trade"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onDelete(trade);
              }}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
              title="Delete trade"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1a202d] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Top highlight stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#151922] border border-[#212735] rounded-md">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-mono">
                Outcome
              </span>
              <span
                className={`text-sm font-bold font-mono ${
                  trade.outcome === 'Win'
                    ? 'text-emerald-400'
                    : trade.outcome === 'Loss'
                    ? 'text-rose-400'
                    : trade.outcome === 'Breakeven'
                    ? 'text-amber-400'
                    : 'text-sky-400'
                }`}
              >
                {trade.outcome}
              </span>
            </div>

            <div className="p-3 bg-[#151922] border border-[#212735] rounded-md">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-mono">
                Realized P&L
              </span>
              <span
                className={`text-sm font-bold font-mono tabular-nums ${
                  isProfitable
                    ? 'text-emerald-400'
                    : isLoss
                    ? 'text-rose-400'
                    : 'text-gray-300'
                }`}
              >
                {trade.realizedPnL !== null
                  ? `${trade.realizedPnL >= 0 ? '+' : ''}$${trade.realizedPnL.toFixed(2)}`
                  : 'Open Trade'}
              </span>
            </div>

            <div className="p-3 bg-[#151922] border border-[#212735] rounded-md">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-mono">
                Position Size
              </span>
              <span className="text-sm font-bold text-white font-mono tabular-nums">
                {trade.positionSize} Lots
              </span>
            </div>

            <div className="p-3 bg-[#151922] border border-[#212735] rounded-md">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-mono">
                Planned Risk
              </span>
              <span className="text-sm font-bold text-gray-200 font-mono tabular-nums">
                {trade.plannedRiskPct}%
              </span>
            </div>
          </div>

          {/* Pricing Execution Grid */}
          <div className="p-4 bg-[#141822] border border-[#1f2635] rounded-md">
            <h4 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider font-mono mb-3">
              Order Execution Prices
            </h4>
            <div className="grid grid-cols-3 gap-4 font-mono text-center">
              <div>
                <span className="text-[10px] text-gray-400 block mb-1">ENTRY</span>
                <span className="text-sm font-semibold text-white tabular-nums">
                  {trade.entryPrice}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-rose-400 block mb-1">STOP LOSS</span>
                <span className="text-sm font-semibold text-rose-400 tabular-nums">
                  {trade.stopLossPrice}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 block mb-1">TAKE PROFIT</span>
                <span className="text-sm font-semibold text-emerald-400 tabular-nums">
                  {trade.takeProfitPrice || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Triple Confluence Breakdown */}
          <div className="p-4 bg-[#141822] border border-[#1f2635] rounded-md space-y-3">
            <h4 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider font-mono">
              Triple Confluence Analysis
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-gray-400 block mb-0.5">Session:</span>
                <span className="text-white font-medium">{trade.session}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Setup Type:</span>
                <span className="text-white font-medium">{trade.setupType}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">H4 Macro Bias:</span>
                <span className="text-white font-medium">{trade.h4Bias}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">H1/M15 Structural Context:</span>
                <span className="text-white font-medium">{trade.h1M15Context || '—'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1e2533] grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                {trade.liquiditySweep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-200">
                  Liquidity Sweep:{' '}
                  <strong className={trade.liquiditySweep ? 'text-emerald-400' : 'text-gray-400'}>
                    {trade.liquiditySweep ? 'Yes' : 'No'}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {trade.m5MssConfirmed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-gray-200">
                  M5 MSS Confirmed:{' '}
                  <strong className={trade.m5MssConfirmed ? 'text-emerald-400' : 'text-gray-400'}>
                    {trade.m5MssConfirmed ? 'Yes' : 'No'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Psychology & Discipline */}
          <div className="p-4 bg-[#141822] border border-[#1f2635] rounded-md space-y-2">
            <h4 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider font-mono">
              Trader Psychology & Rules
            </h4>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="text-gray-400 block mb-0.5">Emotional State:</span>
                <span className="text-white font-medium">{trade.emotionalState}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Discipline Audit:</span>
                <span
                  className={`font-semibold ${
                    trade.ruleFollowed ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {trade.ruleFollowed ? 'Rules Followed' : 'Rule Violated'}
                </span>
              </div>
            </div>

            {trade.lessonsNotes && (
              <div className="pt-2 border-t border-[#1e2533]">
                <span className="text-gray-400 block mb-1">Notes & Lessons:</span>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed bg-[#0e1118] p-3 rounded-md border border-[#1b212d]">
                  {trade.lessonsNotes}
                </p>
              </div>
            )}

            {trade.screenshotUrl && (
              <div className="pt-2 border-t border-[#1e2533]">
                <span className="text-gray-400 block mb-1">Chart Screenshot / Reference:</span>
                <a
                  href={trade.screenshotUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 underline font-mono text-xs break-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>{trade.screenshotUrl}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
