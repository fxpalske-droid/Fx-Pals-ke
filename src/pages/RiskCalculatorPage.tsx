import React, { useState, useMemo } from 'react';
import {
  Calculator,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { CalculatorInputs, TradeDirection } from '../types';
import { calculatePositionSize } from '../utils/calculator';
import { INSTRUMENT_SPECS, DEFAULT_INSTRUMENT_LIST } from '../utils/instruments';

interface RiskCalculatorPageProps {
  initialBalance: number;
  initialRiskPct: number;
  onUpdateDefaultBalance: (bal: number) => void;
  onUpdateDefaultRisk: (risk: number) => void;
  onTransferToJournal: (params: {
    instrument: string;
    direction: TradeDirection;
    entryPrice: number;
    stopLossPrice: number;
    takeProfitPrice: number;
    plannedRiskPct: number;
    positionSize: number;
  }) => void;
}

export const RiskCalculatorPage: React.FC<RiskCalculatorPageProps> = ({
  initialBalance,
  initialRiskPct,
  onUpdateDefaultBalance,
  onUpdateDefaultRisk,
  onTransferToJournal,
}) => {
  const [instrument, setInstrument] = useState<string>('XAUUSD');
  const [direction, setDirection] = useState<TradeDirection>('Buy');
  const [accountBalance, setAccountBalance] = useState<number>(initialBalance || 10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(initialRiskPct || 1.0);

  // Default prices based on selected instrument for quick intuitive testing
  const [entryPrice, setEntryPrice] = useState<number>(2650.0);
  const [stopLossPrice, setStopLossPrice] = useState<number>(2645.0);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(2665.0);

  // Custom contract overrides if instrument is CUSTOM
  const [customContractSize, setCustomContractSize] = useState<number>(100000);
  const [customPipValue, setCustomPipValue] = useState<number>(10.0);

  // Update default prices when instrument changes
  const handleInstrumentChange = (newInst: string) => {
    setInstrument(newInst);
    if (newInst === 'XAUUSD') {
      setEntryPrice(2650.0);
      setStopLossPrice(2645.0);
      setTakeProfitPrice(2665.0);
    } else if (newInst === 'EURUSD') {
      setEntryPrice(1.085);
      setStopLossPrice(1.083);
      setTakeProfitPrice(1.091);
    } else if (newInst === 'GBPJPY') {
      setEntryPrice(190.5);
      setStopLossPrice(190.0);
      setTakeProfitPrice(191.75);
    } else if (newInst === 'GBPAUD') {
      setEntryPrice(1.952);
      setStopLossPrice(1.948);
      setTakeProfitPrice(1.962);
    } else if (newInst === 'USDJPY') {
      setEntryPrice(152.5);
      setStopLossPrice(152.0);
      setTakeProfitPrice(153.75);
    } else if (newInst === 'US30') {
      setEntryPrice(43200);
      setStopLossPrice(43050);
      setTakeProfitPrice(43600);
    }
  };

  const calculationResults = useMemo(() => {
    const inputs: CalculatorInputs = {
      instrument,
      direction,
      accountBalance,
      riskPercentage,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      customContractSize,
      customPipValue,
    };
    return calculatePositionSize(inputs);
  }, [
    instrument,
    direction,
    accountBalance,
    riskPercentage,
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    customContractSize,
    customPipValue,
  ]);

  const handleBalanceBlur = () => {
    if (accountBalance > 0) {
      onUpdateDefaultBalance(accountBalance);
    }
  };

  const handleRiskBlur = () => {
    if (riskPercentage > 0 && riskPercentage <= 100) {
      onUpdateDefaultRisk(riskPercentage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <Calculator className="w-4 h-4" />
            <span>CAPITAL PROTECTION ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Position Size & Risk Calculator
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Instrument-specific lot sizing. Enforces strict dollar risk ceilings and validates directional boundaries.
          </p>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-[#10141c] border border-[#1e2533] rounded-lg p-5 space-y-5 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            1. Trade Inputs
          </h3>

          {/* Instrument & Direction */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Instrument Asset</label>
              <select
                value={instrument}
                onChange={(e) => handleInstrumentChange(e.target.value)}
                className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono font-semibold focus:border-emerald-500 focus:outline-hidden"
              >
                {DEFAULT_INSTRUMENT_LIST.map((sym) => (
                  <option key={sym} value={sym}>
                    {sym} — {INSTRUMENT_SPECS[sym]?.name}
                  </option>
                ))}
                <option value="CUSTOM">Custom Contract Specification</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-medium">Trade Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('Buy')}
                  className={`py-2 px-3 rounded-md font-bold text-center transition-colors font-mono ${
                    direction === 'Buy'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#161c26] border border-[#232b3b] text-gray-400 hover:text-white'
                  }`}
                >
                  BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('Sell')}
                  className={`py-2 px-3 rounded-md font-bold text-center transition-colors font-mono ${
                    direction === 'Sell'
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#161c26] border border-[#232b3b] text-gray-400 hover:text-white'
                  }`}
                >
                  SELL / SHORT
                </button>
              </div>
            </div>
          </div>

          {/* Account Balance & Risk % */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#1b2230]">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Account Balance ($ USD)
              </label>
              <input
                type="number"
                step="100"
                min="10"
                value={accountBalance}
                onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
                onBlur={handleBalanceBlur}
                className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Saved automatically to local settings
              </span>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Risk Per Trade (%)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={riskPercentage}
                  onChange={(e) => setRiskPercentage(parseFloat(e.target.value) || 0)}
                  onBlur={handleRiskBlur}
                  className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                />
                <div className="flex gap-1 shrink-0">
                  {[0.5, 1.0, 2.0].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRiskPercentage(r);
                        onUpdateDefaultRisk(r);
                      }}
                      className={`px-2 py-1 text-[11px] font-mono rounded-md border ${
                        riskPercentage === r
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-[#161c26] text-gray-400 border-[#232b3b]'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Target risk: ${(accountBalance * (riskPercentage / 100)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Execution Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1b2230]">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Entry Price *</label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-medium">Stop Loss Price *</label>
              <input
                type="number"
                step="any"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-rose-400 font-mono focus:border-rose-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-medium">Take Profit Price</label>
              <input
                type="number"
                step="any"
                value={takeProfitPrice}
                onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-emerald-400 font-mono focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Custom Specification Overrides if Custom is chosen */}
          {instrument === 'CUSTOM' && (
            <div className="p-3 bg-[#131822] border border-amber-500/30 rounded-md space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold font-mono text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Custom Instrument Configuration Flagged as Estimate</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Contract Size (Units)</label>
                  <input
                    type="number"
                    value={customContractSize}
                    onChange={(e) => setCustomContractSize(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-2.5 py-1 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Pip Value per Standard Lot ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={customPipValue}
                    onChange={(e) => setCustomPipValue(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-2.5 py-1 text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Validation Error banner if invalid */}
          {!calculationResults.isValid && calculationResults.errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-md flex items-start gap-2.5 text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-mono">
                {calculationResults.errorMessage}
              </div>
            </div>
          )}

          {/* Minimum Lot Constraint Warning if applicable */}
          {calculationResults.minLotConstraintApplied && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-md flex items-start gap-2.5 text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Risk Limit Protection:</strong> Minimum 0.01 lot size at this stop distance would
                risk more than your planned ${calculationResults.dollarRisk.toFixed(2)} limit. Position size
                is kept at 0 to prevent forced overleveraging.
              </div>
            </div>
          )}
        </div>

        {/* Right Output Card (5 Cols) */}
        <div className="lg:col-span-5 bg-[#10141c] border border-[#1e2533] rounded-lg p-5 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2230]">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                2. Sizing Results
              </span>
              <span className="text-[11px] font-mono text-gray-400">
                {calculationResults.specUsed.name}
              </span>
            </div>

            {/* Recommended Position Size Box */}
            <div className="my-4 p-5 bg-[#ffffff] border border-[#1c2331] rounded-lg text-center">
              <span className="text-xs text-gray-400 uppercase tracking-widest block font-mono mb-1">
                RECOMMENDED POSITION SIZE
              </span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight tabular-nums">
                  {calculationResults.suggestedLots}
                </span>
                <span className="text-sm font-mono text-emerald-400 font-bold">LOTS</span>
              </div>
              <span className="text-[11px] text-gray-400 block mt-2 font-mono">
                Max Dollar Risk Ceiling: ${calculationResults.dollarRisk.toFixed(2)}
              </span>
            </div>

            {/* Metrics Breakdown List */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#141822] rounded-md font-mono">
                <span className="text-gray-400">Stop Distance:</span>
                <span className="text-white font-semibold tabular-nums">
                  {calculationResults.stopDistance} ({calculationResults.stopDistancePips} pips/pts)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#141822] rounded-md font-mono">
                <span className="text-gray-400">Target Distance:</span>
                <span className="text-white font-semibold tabular-nums">
                  {calculationResults.targetDistance} ({calculationResults.targetDistancePips} pips/pts)
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#141822] rounded-md font-mono">
                <span className="text-gray-400">Risk-to-Reward Ratio:</span>
                <span
                  className={`font-bold tabular-nums ${
                    calculationResults.riskRewardRatio >= 2
                      ? 'text-emerald-400'
                      : calculationResults.riskRewardRatio > 0
                      ? 'text-amber-400'
                      : 'text-gray-400'
                  }`}
                >
                  {calculationResults.riskRewardRatio > 0
                    ? `1 : ${calculationResults.riskRewardRatio}`
                    : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#141822] rounded-md font-mono">
                <span className="text-rose-400">Estimated Loss at SL:</span>
                <span className="text-rose-400 font-bold tabular-nums">
                  -${calculationResults.estimatedLossUSD.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#141822] rounded-md font-mono">
                <span className="text-emerald-400">Estimated Profit at TP:</span>
                <span className="text-emerald-400 font-bold tabular-nums">
                  +${calculationResults.estimatedProfitUSD.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Contract Specification Transparency */}
            <div className="mt-4 p-3 bg-[#0c0f16] border border-[#181f2b] rounded-md text-[11px] text-gray-400 space-y-1 font-mono">
              <div className="text-gray-300 font-semibold mb-1">Calculation Assumptions:</div>
              <div>· Contract Size: {calculationResults.specUsed.contractSize} units / lot</div>
              <div>· Base Pip/Tick Value: ${calculationResults.specUsed.pipValuePerStandardLotUSD}/pip on 1.0 lot</div>
              <div>· Notes: {calculationResults.specUsed.notes}</div>
            </div>
          </div>

          {/* Copy to Trade Journal Action */}
          <div className="pt-4 border-t border-[#1b2230]">
            <button
              onClick={() => {
                if (calculationResults.isValid && calculationResults.suggestedLots > 0) {
                  onTransferToJournal({
                    instrument,
                    direction,
                    entryPrice,
                    stopLossPrice,
                    takeProfitPrice,
                    plannedRiskPct: riskPercentage,
                    positionSize: calculationResults.suggestedLots,
                  });
                }
              }}
              disabled={!calculationResults.isValid || calculationResults.suggestedLots <= 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Transfer Setup to Trade Journal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Required Disclaimer */}
      <div className="bg-[#0f131a] border border-[#1b222f] rounded-lg px-4 py-3 flex items-start gap-2.5 text-xs text-gray-400">
        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-gray-300 font-medium">Broker Variance Disclaimer:</strong> Actual
          fill prices, spread widening around session opens, broker commission structures, overnight financing,
          and slippage during high-impact news events can affect final realized P&L. Edge Trader performs calculations
          for sizing reference and never initiates orders or interfaces with a live broker.
        </p>
      </div>
    </div>
  );
};
