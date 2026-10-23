import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import {
  EmotionalState,
  TradeDirection,
  TradeEntry,
  TradeOutcome,
  TradingSession,
} from '../../types';
import { DEFAULT_INSTRUMENT_LIST } from '../../utils/instruments';
import {
  toDatetimeLocalInputValue,
  fromDatetimeLocalInputValue,
  getTimezoneOffsetString,
} from '../../utils/timezone';

interface TradeModalProps {
  isOpen: boolean;
  tradeToEdit?: TradeEntry | null;
  initialValues?: Partial<TradeEntry>;
  timeZone: string;
  onClose: () => void;
  onSave: (trade: TradeEntry) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  tradeToEdit,
  initialValues,
  timeZone,
  onClose,
  onSave,
}) => {
  const [localDateTimeInput, setLocalDateTimeInput] = useState<string>('');
  const [formData, setFormData] = useState<Partial<TradeEntry>>({
    dateTime: new Date().toISOString(),
    instrument: 'XAUUSD',
    direction: 'Buy',
    session: 'London-NY Overlap',
    setupType: 'Liquidity Sweep + M5 MSS',
    h4Bias: 'Bullish',
    h1M15Context: 'Premium/Discount array discount zone reaction',
    liquiditySweep: true,
    m5MssConfirmed: true,
    entryPrice: 0,
    stopLossPrice: 0,
    takeProfitPrice: 0,
    plannedRiskPct: 1.0,
    positionSize: 0.1,
    outcome: 'Open',
    realizedPnL: null,
    screenshotUrl: '',
    emotionalState: 'Calm & Disciplined',
    ruleFollowed: true,
    lessonsNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tradeToEdit) {
      setFormData(tradeToEdit);
      setLocalDateTimeInput(toDatetimeLocalInputValue(tradeToEdit.dateTime, timeZone));
    } else if (initialValues) {
      const nowIso = new Date().toISOString();
      setFormData((prev) => ({
        ...prev,
        dateTime: nowIso,
        ...initialValues,
      }));
      setLocalDateTimeInput(toDatetimeLocalInputValue(initialValues.dateTime || nowIso, timeZone));
    } else {
      const nowIso = new Date().toISOString();
      setFormData({
        dateTime: nowIso,
        instrument: 'XAUUSD',
        direction: 'Buy',
        session: 'London-NY Overlap',
        setupType: 'Liquidity Sweep + M5 MSS',
        h4Bias: 'Bullish',
        h1M15Context: 'Key discount area of interest',
        liquiditySweep: true,
        m5MssConfirmed: true,
        entryPrice: 0,
        stopLossPrice: 0,
        takeProfitPrice: 0,
        plannedRiskPct: 1.0,
        positionSize: 0.1,
        outcome: 'Open',
        realizedPnL: null,
        screenshotUrl: '',
        emotionalState: 'Calm & Disciplined',
        ruleFollowed: true,
        lessonsNotes: '',
      });
      setLocalDateTimeInput(toDatetimeLocalInputValue(nowIso, timeZone));
    }
    setErrors({});
  }, [tradeToEdit, initialValues, isOpen, timeZone]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!localDateTimeInput) newErrors.dateTime = 'Date and time are required.';
    if (!formData.instrument?.trim()) newErrors.instrument = 'Instrument is required.';
    if (!formData.entryPrice || Number(formData.entryPrice) <= 0) {
      newErrors.entryPrice = 'Valid entry price is required.';
    }
    if (!formData.stopLossPrice || Number(formData.stopLossPrice) <= 0) {
      newErrors.stopLossPrice = 'Valid stop loss price is required.';
    }
    if (
      formData.entryPrice &&
      formData.stopLossPrice &&
      Number(formData.entryPrice) === Number(formData.stopLossPrice)
    ) {
      newErrors.stopLossPrice = 'Stop loss cannot equal entry price.';
    }
    if (!formData.positionSize || Number(formData.positionSize) <= 0) {
      newErrors.positionSize = 'Position size must be greater than 0.';
    }
    if (
      formData.plannedRiskPct === undefined ||
      Number(formData.plannedRiskPct) <= 0 ||
      Number(formData.plannedRiskPct) > 100
    ) {
      newErrors.plannedRiskPct = 'Planned risk % must be between 0.01% and 100%.';
    }

    if (formData.outcome !== 'Open' && formData.realizedPnL === null) {
      newErrors.realizedPnL = 'Please enter realized P&L ($) for closed trades.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert the local time entered in user's selected timezone to standard unambiguous UTC ISO
    const isoDateTime = fromDatetimeLocalInputValue(localDateTimeInput, timeZone);

    const entryToSave: TradeEntry = {
      id: tradeToEdit ? tradeToEdit.id : `trade_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: tradeToEdit ? tradeToEdit.createdAt : new Date().toISOString(),
      dateTime: isoDateTime,
      instrument: formData.instrument || 'XAUUSD',
      direction: formData.direction as TradeDirection,
      session: formData.session as TradingSession,
      setupType: formData.setupType || 'Discretionary Setup',
      h4Bias: formData.h4Bias as 'Bullish' | 'Bearish' | 'Neutral/Range',
      h1M15Context: formData.h1M15Context || '',
      liquiditySweep: Boolean(formData.liquiditySweep),
      m5MssConfirmed: Boolean(formData.m5MssConfirmed),
      entryPrice: Number(formData.entryPrice),
      stopLossPrice: Number(formData.stopLossPrice),
      takeProfitPrice: Number(formData.takeProfitPrice || 0),
      plannedRiskPct: Number(formData.plannedRiskPct),
      positionSize: Number(formData.positionSize),
      realizedPnL: formData.outcome === 'Open' ? null : Number(formData.realizedPnL),
      outcome: formData.outcome as TradeOutcome,
      screenshotUrl: formData.screenshotUrl?.trim() || undefined,
      emotionalState: formData.emotionalState as EmotionalState,
      ruleFollowed: Boolean(formData.ruleFollowed),
      lessonsNotes: formData.lessonsNotes?.trim() || '',
    };

    onSave(entryToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#11151c] border border-[#232938] rounded-lg shadow-2xl text-gray-200 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f2635] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {tradeToEdit ? 'Edit Trade Entry' : 'Record New Trade'}
            </h2>
            <p className="text-xs text-gray-400">
              Discretionary log. Realized P&L is manual and never assumed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-[#1a202d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Execution Basics */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
              1. Instrument & Timing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-gray-300 font-medium">Date & Time</label>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {timeZone.split('/')[1] || timeZone} ({getTimezoneOffsetString(timeZone)})
                  </span>
                </div>
                <input
                  type="datetime-local"
                  value={localDateTimeInput}
                  onChange={(e) => setLocalDateTimeInput(e.target.value)}
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                />
                {errors.dateTime && <p className="text-rose-400 mt-1">{errors.dateTime}</p>}
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Instrument</label>
                <select
                  value={formData.instrument}
                  onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                >
                  {DEFAULT_INSTRUMENT_LIST.map((sym) => (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  ))}
                  <option value="CUSTOM">Other / Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, direction: 'Buy' })}
                    className={`py-2 px-3 rounded-md font-semibold text-center transition-colors ${
                      formData.direction === 'Buy'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#181d27] border border-[#2c3444] text-gray-300 hover:text-white'
                    }`}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, direction: 'Sell' })}
                    className={`py-2 px-3 rounded-md font-semibold text-center transition-colors ${
                      formData.direction === 'Sell'
                        ? 'bg-rose-600 text-white'
                        : 'bg-[#181d27] border border-[#2c3444] text-gray-300 hover:text-white'
                    }`}
                  >
                    SELL / SHORT
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Session Context</label>
                <select
                  value={formData.session}
                  onChange={(e) =>
                    setFormData({ ...formData, session: e.target.value as TradingSession })
                  }
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="London-NY Overlap">London–New York Overlap (Primary)</option>
                  <option value="London">London Session</option>
                  <option value="New York">New York Session</option>
                  <option value="Asian">Asian Session</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Setup Pattern / Type</label>
                <input
                  type="text"
                  placeholder="e.g. Liquidity Sweep + M5 MSS, FVG Retest"
                  value={formData.setupType}
                  onChange={(e) => setFormData({ ...formData, setupType: e.target.value })}
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Confluence Verification */}
          <div className="pt-3 border-t border-[#1f2635]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
              2. Confluence & Analysis Check
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">H4 Directional Bias</label>
                <select
                  value={formData.h4Bias}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      h4Bias: e.target.value as 'Bullish' | 'Bearish' | 'Neutral/Range',
                    })
                  }
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="Bullish">Bullish Structure</option>
                  <option value="Bearish">Bearish Structure</option>
                  <option value="Neutral/Range">Neutral / Consolidating Range</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  H1/M15 Structural Context
                </label>
                <input
                  type="text"
                  placeholder="e.g. In Discount, tapped unmitigated demand"
                  value={formData.h1M15Context}
                  onChange={(e) => setFormData({ ...formData, h1M15Context: e.target.value })}
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <label className="flex items-center gap-3 p-3 bg-[#161b24] border border-[#262f3f] rounded-md cursor-pointer hover:border-gray-600 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.liquiditySweep}
                  onChange={(e) => setFormData({ ...formData, liquiditySweep: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 bg-gray-900 border-gray-700 rounded-sm focus:ring-emerald-500"
                />
                <div>
                  <span className="font-semibold text-white block">Liquidity Sweep Observed</span>
                  <span className="text-gray-400 text-[11px]">
                    Price raided buy/sell-side liquidity prior to entry
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#161b24] border border-[#262f3f] rounded-md cursor-pointer hover:border-gray-600 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.m5MssConfirmed}
                  onChange={(e) => setFormData({ ...formData, m5MssConfirmed: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 bg-gray-900 border-gray-700 rounded-sm focus:ring-emerald-500"
                />
                <div>
                  <span className="font-semibold text-white block">M5 MSS Confirmed</span>
                  <span className="text-gray-400 text-[11px]">
                    Confirmed Market Structure Shift with body displacement
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Pricing & Execution */}
          <div className="pt-3 border-t border-[#1f2635]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
              3. Execution Pricing & Sizing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Entry Price *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 2650.50"
                  value={formData.entryPrice || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, entryPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                />
                {errors.entryPrice && <p className="text-rose-400 mt-1">{errors.entryPrice}</p>}
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Stop Loss Price *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 2645.00"
                  value={formData.stopLossPrice || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, stopLossPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                />
                {errors.stopLossPrice && (
                  <p className="text-rose-400 mt-1">{errors.stopLossPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Take Profit Price</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 2665.00"
                  value={formData.takeProfitPrice || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, takeProfitPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Planned Risk %</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.01"
                  max="100"
                  placeholder="e.g. 1.0"
                  value={formData.plannedRiskPct ?? 1.0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plannedRiskPct: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                />
                {errors.plannedRiskPct && (
                  <p className="text-rose-400 mt-1">{errors.plannedRiskPct}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Position Size (Lots / Contracts) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g. 0.50"
                  value={formData.positionSize || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, positionSize: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                />
                {errors.positionSize && (
                  <p className="text-rose-400 mt-1">{errors.positionSize}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Outcome & Realized P&L */}
          <div className="pt-3 border-t border-[#1f2635]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
              4. Trade Outcome & Realized Return
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Trade Status / Outcome</label>
                <select
                  value={formData.outcome}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      outcome: e.target.value as TradeOutcome,
                      realizedPnL: e.target.value === 'Open' ? null : formData.realizedPnL,
                    })
                  }
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white font-semibold focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="Open">Open (Active Position)</option>
                  <option value="Win">Win (Hit Target / Closed Profit)</option>
                  <option value="Loss">Loss (Hit Stop / Closed Loss)</option>
                  <option value="Breakeven">Breakeven ($0 / Scratch)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Realized P&L ($ USD)
                  {formData.outcome !== 'Open' && <span className="text-rose-400 ml-1">*</span>}
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder={
                    formData.outcome === 'Open'
                      ? 'N/A (Trade is currently open)'
                      : 'e.g. +250.00 or -100.00'
                  }
                  disabled={formData.outcome === 'Open'}
                  value={formData.realizedPnL ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      realizedPnL: e.target.value === '' ? null : parseFloat(e.target.value),
                    })
                  }
                  className={`w-full bg-[#181d27] border rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden ${
                    formData.outcome === 'Open'
                      ? 'opacity-40 cursor-not-allowed border-[#232938]'
                      : 'border-[#2c3444]'
                  }`}
                />
                {errors.realizedPnL && (
                  <p className="text-rose-400 mt-1">{errors.realizedPnL}</p>
                )}
                <span className="text-[11px] text-gray-400 block mt-1">
                  Manual record. Never derived automatically from risk.
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Psychology & Notes */}
          <div className="pt-3 border-t border-[#1f2635]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
              5. Discipline & Post-Trade Review
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Emotional State</label>
                <select
                  value={formData.emotionalState}
                  onChange={(e) =>
                    setFormData({ ...formData, emotionalState: e.target.value as EmotionalState })
                  }
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="Calm & Disciplined">Calm & Disciplined</option>
                  <option value="Patient">Patient</option>
                  <option value="Anxious">Anxious</option>
                  <option value="FOMO">FOMO (Chasing)</option>
                  <option value="Rushed">Rushed</option>
                  <option value="Revenge">Revenge</option>
                  <option value="Overconfident">Overconfident</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Rule Compliance</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, ruleFollowed: true })}
                    className={`py-2 px-3 rounded-md font-semibold text-center transition-colors ${
                      formData.ruleFollowed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#181d27] border border-[#2c3444] text-gray-400'
                    }`}
                  >
                    Rule Followed
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, ruleFollowed: false })}
                    className={`py-2 px-3 rounded-md font-semibold text-center transition-colors ${
                      !formData.ruleFollowed
                        ? 'bg-rose-600 text-white'
                        : 'bg-[#181d27] border border-[#2c3444] text-gray-400'
                    }`}
                  >
                    Rule Broken
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Screenshot URL or Chart Reference (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://www.tradingview.com/x/... or image link"
                  value={formData.screenshotUrl || ''}
                  onChange={(e) => setFormData({ ...formData, screenshotUrl: e.target.value })}
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Trade Notes, Reasons & Lessons Learned
                </label>
                <textarea
                  rows={3}
                  placeholder="Why did you take this setup? Was entry executed on confirmation? What can be improved?"
                  value={formData.lessonsNotes}
                  onChange={(e) => setFormData({ ...formData, lessonsNotes: e.target.value })}
                  className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#1f2635] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-300 bg-[#171b24] hover:bg-[#202735] border border-[#2a3242] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{tradeToEdit ? 'Save Changes' : 'Record Trade'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
