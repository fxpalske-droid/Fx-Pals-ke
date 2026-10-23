import React, { useState } from 'react';
import {
  Crosshair,
  Save,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { ChartingAnalysis, FinalDecision } from '../types';
import { DEFAULT_INSTRUMENT_LIST } from '../utils/instruments';
import { formatDateTime } from '../utils/timezone';

interface ChartingProcessPageProps {
  analyses: ChartingAnalysis[];
  timeZone: string;
  onSaveAnalysis: (analysis: ChartingAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
}

export const ChartingProcessPage: React.FC<ChartingProcessPageProps> = ({
  analyses,
  timeZone,
  onSaveAnalysis,
  onDeleteAnalysis,
}) => {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  // Form fields
  const [instrument, setInstrument] = useState<string>('XAUUSD');
  const [title, setTitle] = useState<string>('Gold London/NY Setup Analysis');
  const [h4Context, setH4Context] = useState<string>('');
  const [h1Structure, setH1Structure] = useState<string>('');
  const [m15Aoi, setM15Aoi] = useState<string>('');
  const [liquidityPools, setLiquidityPools] = useState<string>('');
  const [inducementHypothesis, setInducementHypothesis] = useState<string>('');
  const [m5Sweep, setM5Sweep] = useState<string>('');
  const [m5Mss, setM5Mss] = useState<string>('');
  const [plannedEntry, setPlannedEntry] = useState<string>('');
  const [plannedStop, setPlannedStop] = useState<string>('');
  const [plannedTarget, setPlannedTarget] = useState<string>('');
  const [invalidationConditions, setInvalidationConditions] = useState<string>('');
  const [finalDecision, setFinalDecision] = useState<FinalDecision>('Wait');
  const [notes, setNotes] = useState<string>('');

  const [notification, setNotification] = useState<string | null>(null);

  const handleClearForm = () => {
    setSelectedAnalysisId(null);
    setInstrument('XAUUSD');
    setTitle('New Analysis Setup');
    setH4Context('');
    setH1Structure('');
    setM15Aoi('');
    setLiquidityPools('');
    setInducementHypothesis('');
    setM5Sweep('');
    setM5Mss('');
    setPlannedEntry('');
    setPlannedStop('');
    setPlannedTarget('');
    setInvalidationConditions('');
    setFinalDecision('Wait');
    setNotes('');
  };

  const handleLoadAnalysis = (analysis: ChartingAnalysis) => {
    setSelectedAnalysisId(analysis.id);
    setInstrument(analysis.instrument);
    setTitle(analysis.title);
    setH4Context(analysis.h4Context);
    setH1Structure(analysis.h1Structure);
    setM15Aoi(analysis.m15Aoi);
    setLiquidityPools(analysis.liquidityPools);
    setInducementHypothesis(analysis.inducementHypothesis);
    setM5Sweep(analysis.m5Sweep);
    setM5Mss(analysis.m5Mss);
    setPlannedEntry(analysis.plannedEntry);
    setPlannedStop(analysis.plannedStop);
    setPlannedTarget(analysis.plannedTarget);
    setInvalidationConditions(analysis.invalidationConditions);
    setFinalDecision(analysis.finalDecision);
    setNotes(analysis.notes);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const analysisToSave: ChartingAnalysis = {
      id: selectedAnalysisId || `analysis_${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: title.trim() || `${instrument} Analysis`,
      instrument,
      h4Context,
      h1Structure,
      m15Aoi,
      liquidityPools,
      inducementHypothesis,
      m5Sweep,
      m5Mss,
      plannedEntry,
      plannedStop,
      plannedTarget,
      invalidationConditions,
      finalDecision,
      notes,
    };

    onSaveAnalysis(analysisToSave);
    setSelectedAnalysisId(analysisToSave.id);
    setNotification('Structured analysis saved to local storage.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <Crosshair className="w-4 h-4" />
            <span>TOP-DOWN MAPPING DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Structured Charting Process
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Manual pre-trade mapping workspace. The decision remains 100% human discretion without simulated detection.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleClearForm}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white bg-[#171c26] hover:bg-[#202735] border border-[#262f3f] rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-xs text-emerald-400 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Structured Mapping Form */}
        <div className="lg:col-span-2 bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-gray-300 mb-1 font-medium">Analysis Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Gold London Low Sweep into H1 Demand"
                  className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-semibold focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">Instrument</label>
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                >
                  {DEFAULT_INSTRUMENT_LIST.map((sym) => (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  ))}
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
            </div>

            {/* Step 1 & 2: H4 & H1 Structure */}
            <div className="pt-4 border-t border-[#1b2230] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                1. Macro Hierarchy (H4 & H1 Structure)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    H4 Directional Context & Major Range
                  </label>
                  <textarea
                    rows={3}
                    value={h4Context}
                    onChange={(e) => setH4Context(e.target.value)}
                    placeholder="Identify major swing high/low, dealing range premium/discount, and higher-timeframe draw on liquidity..."
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    H1 Intermediate Structure
                  </label>
                  <textarea
                    rows={3}
                    value={h1Structure}
                    onChange={(e) => setH1Structure(e.target.value)}
                    placeholder="Document internal trends, recent break of structure (BOS), and momentum characteristics..."
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Step 3 & 4: M15 AOI, Liquidity Pools & Inducement */}
            <div className="pt-4 border-t border-[#1b2230] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                2. Liquidity & Areas of Interest (AOI)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    M15 Area of Interest (AOI)
                  </label>
                  <textarea
                    rows={3}
                    value={m15Aoi}
                    onChange={(e) => setM15Aoi(e.target.value)}
                    placeholder="Specify unmitigated Order Block, Fair Value Gap (FVG), or breaker level..."
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    Liquidity Pools (BSL / SSL)
                  </label>
                  <textarea
                    rows={3}
                    value={liquidityPools}
                    onChange={(e) => setLiquidityPools(e.target.value)}
                    placeholder="Where are retail stops placed? Equal highs, equal lows, previous day high/low..."
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    Inducement Hypothesis
                  </label>
                  <textarea
                    rows={3}
                    value={inducementHypothesis}
                    onChange={(e) => setInducementHypothesis(e.target.value)}
                    placeholder="What false move or minor swing will trap premature traders prior to true move?"
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md p-2.5 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: M5 Execution Checks */}
            <div className="pt-4 border-t border-[#1b2230] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                3. M5 Execution Confirmation (Manual Observation)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    M5 Liquidity Sweep Details
                  </label>
                  <input
                    type="text"
                    value={m5Sweep}
                    onChange={(e) => setM5Sweep(e.target.value)}
                    placeholder="e.g. Asia low swept by 8 pips into M15 Demand with rapid rejection"
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">
                    M5 Market Structure Shift (MSS)
                  </label>
                  <input
                    type="text"
                    value={m5Mss}
                    onChange={(e) => setM5Mss(e.target.value)}
                    placeholder="e.g. M5 swing high broken with full candle body closure and displacement"
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Step 6: Pricing, Invalidation & Decision */}
            <div className="pt-4 border-t border-[#1b2230] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                4. Execution Parameters & Final Verdict
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Planned Entry</label>
                  <input
                    type="text"
                    value={plannedEntry}
                    onChange={(e) => setPlannedEntry(e.target.value)}
                    placeholder="e.g. Retest of M5 FVG at 2648.50"
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Planned Stop Loss</label>
                  <input
                    type="text"
                    value={plannedStop}
                    onChange={(e) => setPlannedStop(e.target.value)}
                    placeholder="e.g. Structural low at 2643.00"
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Planned Target</label>
                  <input
                    type="text"
                    value={plannedTarget}
                    onChange={(e) => setPlannedTarget(e.target.value)}
                    placeholder="e.g. BSL resting at 2665.00"
                    className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Trade Invalidation Conditions (When to Cancel / Not Enter)
                </label>
                <input
                  type="text"
                  value={invalidationConditions}
                  onChange={(e) => setInvalidationConditions(e.target.value)}
                  placeholder="e.g. If London pushes through 2640 with candle closes without any MSS, setup is void."
                  className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Final Decision Selector */}
              <div>
                <label className="block text-gray-300 mb-1 font-medium">
                  Discretionary Final Decision
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Wait', 'Valid Setup', 'No Trade'] as FinalDecision[]).map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setFinalDecision(d)}
                      className={`py-2 px-3 rounded-md font-bold text-center transition-colors font-mono ${
                        finalDecision === d
                          ? d === 'Valid Setup'
                            ? 'bg-emerald-600 text-white'
                            : d === 'Wait'
                            ? 'bg-amber-600 text-white'
                            : 'bg-rose-600 text-white'
                          : 'bg-[#161c26] border border-[#232b3b] text-gray-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-[#1b2230] flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Analysis Note Locally</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Saved Analyses Library */}
        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-white mb-1">
            Saved Analysis Library ({analyses.length})
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Click any saved setup to load it into the workspace.
          </p>

          {analyses.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 bg-[#0e1117] rounded-md border border-[#181e2b] my-auto">
              No saved analyses yet. Fill the structured form on the left and click &quot;Save Analysis Note Locally&quot;.
            </div>
          ) : (
            <div className="space-y-2.5 overflow-y-auto max-h-[600px] pr-1">
              {analyses.map((a) => (
                <div
                  key={a.id}
                  onClick={() => handleLoadAnalysis(a)}
                  className={`p-3 rounded-md border text-xs cursor-pointer transition-colors ${
                    selectedAnalysisId === a.id
                      ? 'bg-[#151c28] border-emerald-500'
                      : 'bg-[#0e1218] border-[#1a212e] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-bold text-white truncate">{a.title}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs shrink-0 font-semibold ${
                        a.finalDecision === 'Valid Setup'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : a.finalDecision === 'Wait'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {a.finalDecision}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mt-2">
                    <span className="text-emerald-400 font-bold">{a.instrument}</span>
                    <span>{formatDateTime(a.createdAt, timeZone)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAnalysis(a.id);
                        if (selectedAnalysisId === a.id) handleClearForm();
                      }}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      title="Delete saved analysis"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
