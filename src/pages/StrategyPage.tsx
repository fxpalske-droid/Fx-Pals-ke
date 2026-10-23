import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Activity,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  ChevronRight,
} from 'lucide-react';
import { TabAccentColor, getTabColorConfig } from '../utils/theme';

interface StrategyPageProps {
  tabColor?: TabAccentColor;
}

export const StrategyPage: React.FC<StrategyPageProps> = ({ tabColor = 'pink' }) => {
  const colorConfig = getTabColorConfig(tabColor);
  const [activeTab, setActiveTab] = useState<'overview' | 'workflow' | 'tester'>('overview');

  // Interactive setup confluence validator
  const [testSMC, setTestSMC] = useState<boolean>(false);
  const [testPA, setTestPA] = useState<boolean>(false);
  const [testOverlap, setTestOverlap] = useState<boolean>(false);
  const [testH4Bias, setTestH4Bias] = useState<string>('Bullish');
  const [testAoiReached, setTestAoiReached] = useState<boolean>(false);
  const [testSweepObserved, setTestSweepObserved] = useState<boolean>(false);
  const [testMssConfirmed, setTestMssConfirmed] = useState<boolean>(false);

  const confluencesConfirmed = [testSMC, testPA, testOverlap].filter(Boolean).length;
  const executionReadiness = [testAoiReached, testSweepObserved, testMssConfirmed].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Strategy Header */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
          <Compass className="w-4 h-4" />
          <span>TRADING FRAMEWORK</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          The Triple Confluence Method
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-3xl leading-relaxed">
          A disciplined, discretionary methodology aligning higher-timeframe liquidity structure with
          lower-timeframe execution confirmation during peak institutional volume windows.
        </p>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#1b2230]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'overview'
                ? colorConfig.activeTabBtn
                : 'text-gray-400 hover:text-white bg-[#151a24]'
            }`}
          >
            The 3 Confluences
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'workflow'
                ? colorConfig.activeTabBtn
                : 'text-gray-400 hover:text-white bg-[#151a24]'
            }`}
          >
            Top-Down Workflow (H4 → M5)
          </button>
          <button
            onClick={() => setActiveTab('tester')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'tester'
                ? colorConfig.activeTabBtn
                : 'text-gray-400 hover:text-white bg-[#151a24]'
            }`}
          >
            Interactive Setup Validator
          </button>
        </div>
      </div>

      {/* Tab 1: The 3 Confluences */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Formula Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold block mb-1">
                Confluence 1 · Context
              </span>
              <h3 className="text-base font-bold text-white mb-1">Smart Money Concepts</h3>
              <p className="text-xs text-gray-400">
                Structural & Liquidity Context: Macro dealing ranges, liquidity pools, and inducement zones.
              </p>
            </div>

            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4">
              <span className={`text-[10px] ${colorConfig.textAccent} uppercase tracking-widest font-mono font-bold block mb-1`}>
                Confluence 2 · Execution
              </span>
              <h3 className="text-base font-bold text-white mb-1">Price Action</h3>
              <p className="text-xs text-gray-400">
                Confirmation & Entry Trigger: Market structure shifts (MSS), displacement candles, and invalidation rules.
              </p>
            </div>

            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono font-bold block mb-1">
                Confluence 3 · Timing
              </span>
              <h3 className="text-base font-bold text-white mb-1">London–NY Overlap</h3>
              <p className="text-xs text-gray-400">
                Session Context (13:00–17:00 UTC): Institutional order flow window. Contextual filter, never a standalone guarantee.
              </p>
            </div>
          </div>

          {/* Deep Dives */}
          <div className="space-y-4">
            {/* Confluence 1 */}
            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Confluence 1: Smart Money Concepts (SMC)
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono">
                    Purpose: Structural & Liquidity Context
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                <div className="space-y-2 bg-[#0c0f16] p-4 rounded-md border border-[#181f2b]">
                  <h4 className="font-semibold text-white">Key Structural Elements</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-gray-400">
                    <li>
                      <strong className="text-gray-200">Macro Dealing Ranges:</strong> Evaluating whether price is currently in an institutional Premium (expensive) or Discount (cheap) array.
                    </li>
                    <li>
                      <strong className="text-gray-200">Liquidity Pools:</strong> Identifying resting liquidity resting above swing highs (BSL) and below clean swing lows (SSL).
                    </li>
                    <li>
                      <strong className="text-gray-200">Inducement:</strong> Recognizing internal minor highs/lows designed to entice premature market orders prior to the true draw on liquidity.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 bg-[#0c0f16] p-4 rounded-md border border-[#181f2b]">
                  <h4 className="font-semibold text-white">Application Rule</h4>
                  <p className="text-gray-400 leading-relaxed">
                    SMC is used strictly to understand where the market has come from, where resting liquidity sits, and what price is likely reaching toward (the &ldquo;Draw on Liquidity&rdquo;). It gives direction, not an immediate trigger to click buy or sell.
                  </p>
                </div>
              </div>
            </div>

            {/* Confluence 2 */}
            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${colorConfig.badge} rounded-md`}>
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Confluence 2: Price Action</h3>
                  <p className={`text-xs ${colorConfig.textAccent} font-mono`}>
                    Purpose: Confirmation & Execution Trigger
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                <div className="space-y-2 bg-[#0c0f16] p-4 rounded-md border border-[#181f2b]">
                  <h4 className="font-semibold text-white">Execution Confirmation Requirements</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-gray-400">
                    <li>
                      <strong className="text-gray-200">Liquidity Sweep:</strong> Price reaches the designated Area of Interest (AOI) and purges resting orders with an aggressive wick.
                    </li>
                    <li>
                      <strong className="text-gray-200">Market Structure Shift (MSS):</strong> Price reverses and closes past the most recent opposing swing point with displacement candle bodies.
                    </li>
                    <li>
                      <strong className="text-gray-200">Displacement:</strong> Energetic candles showing evident institutional intent rather than slow, hesitant overlapping candles.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 bg-[#0c0f16] p-4 rounded-md border border-[#181f2b]">
                  <h4 className="font-semibold text-white">Application Rule</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Never enter merely because price has arrived at a support or resistance line or order block. Entry is only valid once the liquidity raid occurs and the M5 structure actively shifts in your favor.
                  </p>
                </div>
              </div>
            </div>

            {/* Confluence 3 */}
            <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Confluence 3: London–New York Overlap
                  </h3>
                  <p className="text-xs text-amber-400 font-mono">
                    Purpose: Timing Context & Volume Filter
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                <div className="space-y-2 bg-[#0c0f16] p-4 rounded-md border border-[#181f2b]">
                  <h4 className="font-semibold text-white">Session Characteristics</h4>
                  <ul className="space-y-1.5 list-disc list-inside text-gray-400">
                    <li>
                      <strong className="text-gray-200">Window:</strong> 13:00 to 17:00 UTC (8:00 AM – 12:00 PM EST).
                    </li>
                    <li>
                      <strong className="text-gray-200">Institutional Liquidity:</strong> The overlap represents the highest concentration of trading volume in global forex and gold markets.
                    </li>
                    <li>
                      <strong className="text-gray-200">True Expansions:</strong> Higher probability of sustained trend continuation or clean session reversals following the London sweep.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 bg-[#0c0f16] p-4 rounded-md border border-[#181f2b]">
                  <h4 className="font-semibold text-white">Contextual Filter Warning</h4>
                  <p className="text-gray-400 leading-relaxed">
                    The London-New York Overlap is a timing filter, not a standalone guarantee of a profitable trade. A high-volume session without SMC alignment or confirmed price action is simply a fast way to lose capital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Top-Down Workflow */}
      {activeTab === 'workflow' && (
        <div className="space-y-4">
          <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
            <h3 className="text-sm font-bold text-white mb-2">
              Top-Down Analysis Execution Hierarchy
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Respect the hierarchy: never search for an entry on M5 until H4 bias and H1/M15 areas of interest are established.
            </p>

            <div className="space-y-4">
              {/* Step H4 */}
              <div className="flex gap-4 p-4 bg-[#0d1017] border border-[#1d2331] rounded-lg">
                <div className="w-12 h-12 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  H4
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">Higher Timeframe Directional Context</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-xs font-mono">
                      MACRO
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Identify the major swing high and swing low forming the active dealing range. Determine if the overall market structure is Bullish, Bearish, or Ranging. Locate major premium/discount boundaries and clear higher-timeframe liquidity targets.
                  </p>
                </div>
              </div>

              {/* Step H1 and M15 */}
              <div className="flex gap-4 p-4 bg-[#0d1017] border border-[#1d2331] rounded-lg">
                <div className={`w-12 h-12 rounded-md ${colorConfig.badge} flex items-center justify-center font-mono font-bold text-xs shrink-0`}>
                  H1/M15
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">Intermediate Structure & Areas of Interest (AOI)</h4>
                    <span className={`text-[10px] px-2 py-0.5 ${colorConfig.badge} rounded-xs font-mono`}>
                      STRUCTURAL
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Map key unmitigated Order Blocks (OB), Fair Value Gaps (FVG), and obvious equal highs or equal lows (EQH/EQL). Formulate your setup hypothesis: will price sweep Asian session high/low before reacting at our M15 AOI?
                  </p>
                </div>
              </div>

              {/* Step M5 */}
              <div className="flex gap-4 p-4 bg-[#0d1017] border border-[#1d2331] rounded-lg">
                <div className="w-12 h-12 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  M5
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">Execution Timeframe & Confirmation</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-xs font-mono">
                      TRIGGER
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Watch price enter the designated M15 AOI. Wait for the liquidity sweep (wick through the level). Then, wait for the M5 Market Structure Shift (MSS) candle close. Place limit or market entry at the breaker, FVG, or retest with a protected invalidation stop loss.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Setup Validator */}
      {activeTab === 'tester' && (
        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
          <h3 className="text-sm font-bold text-white mb-1">
            Personal Discretionary Setup Validator
          </h3>
          <p className="text-xs text-gray-400 mb-5">
            Audit potential trading opportunities against the Triple Confluence Method prior to risking capital.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Left: Confluence Checkboxes */}
            <div className="space-y-4">
              <h4 className="font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                1. Macro & Timing Confluences
              </h4>

              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-[#141822] border border-[#202735] rounded-md cursor-pointer hover:border-gray-600">
                  <input
                    type="checkbox"
                    checked={testSMC}
                    onChange={(e) => setTestSMC(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-xs"
                  />
                  <div>
                    <span className="font-semibold text-white block">SMC Context Clear</span>
                    <span className="text-gray-400 text-[11px]">
                      H4 directional bias identified and dealing range mapped (Premium vs Discount)
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#141822] border border-[#202735] rounded-md cursor-pointer hover:border-gray-600">
                  <input
                    type="checkbox"
                    checked={testPA}
                    onChange={(e) => setTestPA(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-xs"
                  />
                  <div>
                    <span className="font-semibold text-white block">Price Action Confirmed</span>
                    <span className="text-gray-400 text-[11px]">
                      Clear displacement with confirmed candle body breaks
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#141822] border border-[#202735] rounded-md cursor-pointer hover:border-gray-600">
                  <input
                    type="checkbox"
                    checked={testOverlap}
                    onChange={(e) => setTestOverlap(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-xs"
                  />
                  <div>
                    <span className="font-semibold text-white block">Active Overlap Window</span>
                    <span className="text-gray-400 text-[11px]">
                      London–New York session overlap (13:00–17:00 UTC)
                    </span>
                  </div>
                </label>
              </div>

              <h4 className="font-semibold text-emerald-400 uppercase tracking-wider font-mono pt-3">
                2. Execution Protocol
              </h4>

              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-[#141822] border border-[#202735] rounded-md cursor-pointer hover:border-gray-600">
                  <input
                    type="checkbox"
                    checked={testAoiReached}
                    onChange={(e) => setTestAoiReached(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-xs"
                  />
                  <div>
                    <span className="font-semibold text-white block">Price in Valid AOI</span>
                    <span className="text-gray-400 text-[11px]">
                      Price has reached predetermined M15/H1 key level
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#141822] border border-[#202735] rounded-md cursor-pointer hover:border-gray-600">
                  <input
                    type="checkbox"
                    checked={testSweepObserved}
                    onChange={(e) => setTestSweepObserved(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-xs"
                  />
                  <div>
                    <span className="font-semibold text-white block">M5 Liquidity Sweep Observed</span>
                    <span className="text-gray-400 text-[11px]">
                      Resting stops intentionally raided into the level
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#141822] border border-[#202735] rounded-md cursor-pointer hover:border-gray-600">
                  <input
                    type="checkbox"
                    checked={testMssConfirmed}
                    onChange={(e) => setTestMssConfirmed(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-xs"
                  />
                  <div>
                    <span className="font-semibold text-white block">M5 MSS Confirmed with Displacement</span>
                    <span className="text-gray-400 text-[11px]">
                      Opposing swing point broken by candle body
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Right: Verification Status Verdict */}
            <div className="bg-[#141822] border border-[#202735] rounded-lg p-5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2">
                  Setup Readiness Audit
                </span>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold font-mono text-white">
                    {confluencesConfirmed + executionReadiness}/6
                  </span>
                  <span className="text-xs text-gray-400">Criteria Met</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#202735]">
                    <span className="text-gray-400">Core Confluences:</span>
                    <span className="font-mono text-white font-bold">{confluencesConfirmed}/3</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#202735]">
                    <span className="text-gray-400">Execution Confirmations:</span>
                    <span className="font-mono text-white font-bold">{executionReadiness}/3</span>
                  </div>
                </div>

                {/* Verdict Box */}
                {confluencesConfirmed + executionReadiness === 6 ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>VALID SETUP — EXECUTE WITH STRUCTURE</span>
                    </div>
                    <p className="text-[11px] text-gray-300">
                      All confluences and execution confirmation criteria satisfied. Calculate position size in the Risk Calculator before placing order.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-md">
                    <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>WAIT — MISSING CONFIRMATION</span>
                    </div>
                    <p className="text-[11px] text-gray-300">
                      Remember principle #4 & #5: Do not anticipate confirmation because of FOMO. No confirmation, no entry.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#202735] text-[11px] text-gray-400 font-mono">
                The validator supports discretionary judgment and does not automate execution.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
