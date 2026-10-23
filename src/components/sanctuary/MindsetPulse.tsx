import React, { useState } from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { EmotionalState } from '../../types';
import { NavPage } from '../layout/Sidebar';

interface MindsetPulseProps {
  onNavigate?: (page: NavPage) => void;
}

interface EmotionAudit {
  state: EmotionalState;
  color: string;
  badge: string;
  guidance: string;
  readyToTrade: boolean;
  recommendedAction: string;
}

const AUDITS: Record<EmotionalState, EmotionAudit> = {
  'Calm & Disciplined': {
    state: 'Calm & Disciplined',
    color: 'emerald',
    badge: 'OPTIMAL TRADING PSYCHE',
    guidance: 'Autonomic nervous system is regulated. You are detached from financial outcome and primed to execute strictly upon verified confirmation.',
    readyToTrade: true,
    recommendedAction: 'Proceed to Premarket Routine and wait patiently for your setup.',
  },
  Patient: {
    state: 'Patient',
    color: 'emerald',
    badge: 'FAVORABLE EXECUTION STATE',
    guidance: 'You respect the market timetable. Zero rush. Ready to observe without forcing entries.',
    readyToTrade: true,
    recommendedAction: 'Verify the London–NY overlap window and monitor structural liquidity.',
  },
  Anxious: {
    state: 'Anxious',
    color: 'amber',
    badge: 'ELEVATED CORTISOL DETECTED',
    guidance: 'Fear of loss or market uncertainty is creating muscle tension. Risk of premature exit or hesitant entry.',
    readyToTrade: false,
    recommendedAction: 'Engage in 5 minutes of 4-7-8 Deep Calm breathwork and cut planned risk in half (0.5%).',
  },
  FOMO: {
    state: 'FOMO',
    color: 'amber',
    badge: 'IMPULSE HAZARD: HIGH CHASE RISK',
    guidance: 'You feel urgent pressure to participate in a moving candle. Proximity is NOT confirmation. Chasing candles will destroy capital.',
    readyToTrade: false,
    recommendedAction: 'Step away from the screen for 10 minutes. Re-read Cardinal Rule #5.',
  },
  Rushed: {
    state: 'Rushed',
    color: 'amber',
    badge: 'TIME PRESSURE VULNERABILITY',
    guidance: 'Trying to squeeze a trade in before leaving or between commitments. Discretionary trading requires undivided focus.',
    readyToTrade: false,
    recommendedAction: 'Do not open orders today. Close the platform and preserve equity.',
  },
  Revenge: {
    state: 'Revenge',
    color: 'rose',
    badge: 'CRITICAL DANGER: DO NOT TRADE',
    guidance: 'Attempting to recoup a recent loss. You are emotionally compromised and viewing the market as an adversary. Probability of severe drawdown: 90%+.',
    readyToTrade: false,
    recommendedAction: 'CLOSE THE TERMINAL IMMEDIATELY. Walk outside. No trades permitted today.',
  },
  Overconfident: {
    state: 'Overconfident',
    color: 'amber',
    badge: 'EUPHORIA HAZARD: POSITION BLIND SPOT',
    guidance: 'After a winning streak, traders frequently increase lot size or skip confirmation. The market does not care about past wins.',
    readyToTrade: false,
    recommendedAction: 'Keep strict 0.5% – 1.0% risk. Require all 3 confluences without compromise.',
  },
};

export const MindsetPulse: React.FC<MindsetPulseProps> = ({ onNavigate }) => {
  const [selectedState, setSelectedState] = useState<EmotionalState>('Calm & Disciplined');

  const audit = AUDITS[selectedState];

  return (
    <div className="bg-[#0e121a] border border-[#1b2230] rounded-xl p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#181d28]">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <HeartPulse className="w-4 h-4" />
          <span>PRE-SESSION PSYCHOLOGICAL PULSE CHECK</span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">Honest Self-Assessment</span>
      </div>

      {/* Selectable State Chips */}
      <div className="space-y-1.5">
        <label className="text-xs text-gray-300 block font-medium">
          Select your present mental & emotional state:
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(AUDITS) as EmotionalState[]).map((stateKey) => {
            const isSelected = selectedState === stateKey;
            const a = AUDITS[stateKey];
            let activeClass = 'bg-[#141822] text-gray-400 hover:text-white border-[#222a3a]';
            if (isSelected) {
              if (a.color === 'emerald') {
                activeClass = 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold';
              } else if (a.color === 'amber') {
                activeClass = 'bg-amber-950 text-amber-300 border-amber-600 font-bold';
              } else {
                activeClass = 'bg-rose-950 text-rose-300 border-rose-600 font-bold';
              }
            }

            return (
              <button
                key={stateKey}
                onClick={() => setSelectedState(stateKey)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-all ${activeClass}`}
              >
                {stateKey}
              </button>
            );
          })}
        </div>
      </div>

      {/* Guidance Assessment Box */}
      <div
        className={`p-4 rounded-lg border text-xs space-y-2 ${
          audit.readyToTrade
            ? 'bg-[#101a15] border-emerald-900/60'
            : audit.color === 'rose'
            ? 'bg-[#210f13] border-rose-900/80'
            : 'bg-[#1f1910] border-amber-900/60'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {audit.readyToTrade ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : audit.color === 'rose' ? (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
            <span
              className={`font-mono text-[11px] font-bold ${
                audit.color === 'emerald'
                  ? 'text-emerald-400'
                  : audit.color === 'rose'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {audit.badge}
            </span>
          </div>

          <span
            className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
              audit.readyToTrade
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            {audit.readyToTrade ? 'Execution Cleared' : 'Execution Prohibited'}
          </span>
        </div>

        <p className="text-gray-200 leading-relaxed">{audit.guidance}</p>

        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-gray-300">
            <strong>Prescription:</strong> {audit.recommendedAction}
          </span>

          {audit.readyToTrade && onNavigate && (
            <button
              onClick={() => onNavigate('premarket')}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] font-bold shrink-0"
            >
              <span>Go to Premarket Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
