import React, { useState } from 'react';
import { Quote, ArrowRight, ArrowLeft, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface Mantra {
  doctrine: string;
  category: 'Detachment' | 'Patience' | 'Risk Acceptance' | 'Preservation' | 'Process Over Outcome';
  context: string;
}

const MANTRAS: Mantra[] = [
  {
    doctrine: 'I do not force trades. I wait for the market to come into my predefined Area of Interest.',
    category: 'Patience',
    context: 'The market has no obligation to yield a setup today. Sitting on hands is a position of strength.',
  },
  {
    doctrine: 'A missed trade costs $0.00. A forced trade costs capital, emotional energy, and discipline.',
    category: 'Detachment',
    context: 'Never let FOMO drive an entry. The market will offer another high-probability setup tomorrow.',
  },
  {
    doctrine: 'I accept full financial risk before placing the order. Once filled, my stop loss is sacred.',
    category: 'Risk Acceptance',
    context: 'Never widen a stop loss or hope for a reversal. Invalidation is part of the mathematical edge.',
  },
  {
    doctrine: 'My edge is statistical over 100 trades, not emotional on this single trade.',
    category: 'Process Over Outcome',
    context: 'One loss or one win proves nothing. Focus strictly on flawless execution of the 9 rules.',
  },
  {
    doctrine: 'Preserving capital is my primary responsibility; capturing profit is strictly secondary.',
    category: 'Preservation',
    context: 'If you protect your downside with 0.5%–1.0% risk, the upside takes care of itself mathematically.',
  },
  {
    doctrine: 'I trade what the charts show, not what my ego hopes or fears.',
    category: 'Detachment',
    context: 'Leave predictions behind. Confirm the M5 sweep, confirm the MSS displacement, then execute coldly.',
  },
  {
    doctrine: 'I never revenge trade. Taking a scheduled loss according to plan is a professional success.',
    category: 'Process Over Outcome',
    context: 'A disciplined loss is a badge of honor. Revenge trades are the hallmark of unprincipled gamblers.',
  },
];

export const TraderAffirmations: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MANTRAS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MANTRAS.length) % MANTRAS.length);
  };

  const activeMantra = MANTRAS[currentIndex];

  return (
    <div className="bg-[#0e121a] border border-[#1b2230] rounded-xl p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#181d28]">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Quote className="w-4 h-4" />
          <span>PSYCHOLOGICAL ANCHOR & TRADING MANTRAS</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{MANTRAS.length}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="py-4 sm:py-6 px-4 bg-[#121622] border border-[#1e2536] rounded-lg relative overflow-hidden">
        <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] text-emerald-400 border border-emerald-900/40">
          {activeMantra.category}
        </div>

        <p className="text-base sm:text-lg font-semibold text-white tracking-tight leading-snug sm:leading-relaxed max-w-2xl">
          &ldquo;{activeMantra.doctrine}&rdquo;
        </p>

        <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-[#1b2233] leading-relaxed">
          {activeMantra.context}
        </p>
      </div>

      {/* Carousel Navigation */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141924] hover:bg-[#1a2130] border border-[#222b3d] rounded-md text-xs font-mono text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1.5">
          {MANTRAS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-emerald-400 w-5' : 'bg-[#252f42] hover:bg-gray-500'
              }`}
              title={`Go to mantra ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141924] hover:bg-[#1a2130] border border-[#222b3d] rounded-md text-xs font-mono text-gray-300 hover:text-white transition-colors"
        >
          <span>Next Anchor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
