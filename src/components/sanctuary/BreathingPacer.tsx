import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Sparkles, Wind } from 'lucide-react';
import { BreathingPattern } from '../../types';
import { soundscapeEngine } from '../../utils/soundscapes';

interface BreathingPacerProps {
  onSessionComplete: (durationSeconds: number, pattern: BreathingPattern) => void;
}

interface PatternConfig {
  name: string;
  subtitle: string;
  description: string;
  phases: { name: 'Inhale' | 'Hold' | 'Exhale' | 'Hold Empty'; duration: number; cue: string }[];
}

const PATTERNS: Record<BreathingPattern, PatternConfig> = {
  box: {
    name: 'Box Breathing (4-4-4-4)',
    subtitle: 'Navy SEAL / High-Performance Standard',
    description: 'Stabilizes the autonomic nervous system, quiets mental chatter, and restores executive control before trading.',
    phases: [
      { name: 'Inhale', duration: 4, cue: 'Breathe in slowly through the nose' },
      { name: 'Hold', duration: 4, cue: 'Hold breath gently without tension' },
      { name: 'Exhale', duration: 4, cue: 'Release breath smoothly through the mouth' },
      { name: 'Hold Empty', duration: 4, cue: 'Rest in quiet stillness before next inhale' },
    ],
  },
  'calm-478': {
    name: '4-7-8 Deep Calm',
    subtitle: 'Parasympathetic Reset for High Anxiety',
    description: 'Drastically lowers heart rate, down-regulates cortisol, and dissolves pre-market anxiety or FOMO urges.',
    phases: [
      { name: 'Inhale', duration: 4, cue: 'Quiet inhale through nose' },
      { name: 'Hold', duration: 7, cue: 'Hold breath with calm focus' },
      { name: 'Exhale', duration: 8, cue: 'Slow, complete audible exhale' },
    ],
  },
  'coherent-55': {
    name: 'Coherent 5-5 Rhythm',
    subtitle: 'Heart-Brain Synchronization',
    description: 'Smooth 6 breaths-per-minute cadence that balances heart rate variability (HRV) for intuitive pattern recognition.',
    phases: [
      { name: 'Inhale', duration: 5, cue: 'Smooth continuous expansion' },
      { name: 'Exhale', duration: 5, cue: 'Smooth continuous release' },
    ],
  },
  'tactical-sigh': {
    name: 'Tactical Reset (Physiological Sigh)',
    subtitle: 'Fast Adrenaline Clearer',
    description: 'Two quick inhales followed by an extended sigh. The fastest biological method to stop a panic or revenge impulse.',
    phases: [
      { name: 'Inhale', duration: 2, cue: 'First deep inhale through nose' },
      { name: 'Hold', duration: 1, cue: 'Top off lungs with short secondary sip' },
      { name: 'Exhale', duration: 6, cue: 'Long relaxed sigh out mouth' },
    ],
  },
};

const DURATIONS = [
  { label: '2 Min', seconds: 120 },
  { label: '3 Min', seconds: 180 },
  { label: '5 Min', seconds: 300 },
  { label: '10 Min', seconds: 600 },
];

export const BreathingPacer: React.FC<BreathingPacerProps> = ({ onSessionComplete }) => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>('box');
  const [targetDuration, setTargetDuration] = useState<number>(180); // 3 mins default
  const [isActive, setIsActive] = useState<boolean>(false);
  const [elapsedTotal, setElapsedTotal] = useState<number>(0);

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [chimeEnabled, setChimeEnabled] = useState<boolean>(true);
  const [completedNotice, setCompletedNotice] = useState<boolean>(false);

  const activePatternConfig = PATTERNS[selectedPattern];
  const currentPhase = activePatternConfig.phases[currentPhaseIndex];

  // Reset phase when pattern changes
  useEffect(() => {
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(activePatternConfig.phases[0].duration);
    setElapsedTotal(0);
    setIsActive(false);
  }, [selectedPattern]);

  // Main timer tick
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsedTotal((prev) => {
        const next = prev + 1;
        if (targetDuration > 0 && next >= targetDuration) {
          // Completed session
          setIsActive(false);
          soundscapeEngine.playChime(528);
          onSessionComplete(targetDuration, selectedPattern);
          setCompletedNotice(true);
          setTimeout(() => setCompletedNotice(false), 5000);
          return targetDuration;
        }
        return next;
      });

      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          const nextIndex = (currentPhaseIndex + 1) % activePatternConfig.phases.length;
          setCurrentPhaseIndex(nextIndex);
          const nextDuration = activePatternConfig.phases[nextIndex].duration;

          // Play subtle phase chime
          if (chimeEnabled) {
            const freq = nextIndex === 0 ? 528 : 432;
            soundscapeEngine.playChime(freq);
          }

          return nextDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex, activePatternConfig, targetDuration, selectedPattern, chimeEnabled, onSessionComplete]);

  const handleStart = () => {
    setIsActive(true);
    setCompletedNotice(false);
    if (chimeEnabled && elapsedTotal === 0) {
      soundscapeEngine.playChime(528);
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setElapsedTotal(0);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(activePatternConfig.phases[0].duration);
  };

  // Calculate visual scale of breathing circle
  // Inhale -> growing, Exhale -> shrinking, Hold -> steady
  const getScaleClass = () => {
    if (!isActive) return 'scale-90';
    if (currentPhase.name === 'Inhale') return 'scale-125';
    if (currentPhase.name === 'Hold') return 'scale-125';
    if (currentPhase.name === 'Exhale') return 'scale-85';
    return 'scale-85';
  };

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = targetDuration > 0 ? Math.min(100, Math.round((elapsedTotal / targetDuration) * 100)) : 0;

  return (
    <div className="bg-[#0e121a] border border-[#1b2230] rounded-xl p-6 sm:p-8 flex flex-col items-center">
      {/* Pattern Selection Header */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#181d28]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Wind className="w-4 h-4" />
            <span>BREATHWORK PACER & NERVOUS SYSTEM REGULATOR</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {activePatternConfig.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {activePatternConfig.subtitle} — {activePatternConfig.description}
          </p>
        </div>

        {/* Chime audio toggle */}
        <button
          onClick={() => setChimeEnabled(!chimeEnabled)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition-colors shrink-0 ${
            chimeEnabled
              ? 'bg-[#15201a] border-emerald-900/60 text-emerald-400'
              : 'bg-[#141822] border-[#222938] text-gray-400'
          }`}
          title="Toggle crystal chime on breath phase change"
        >
          {chimeEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{chimeEnabled ? 'Chimes Active' : 'Chimes Muted'}</span>
        </button>
      </div>

      {/* Pattern & Target Duration Selectors */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 my-5">
        {/* Pattern tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#121622] p-1 rounded-lg border border-[#1e2536]">
          {(['box', 'calm-478', 'coherent-55', 'tactical-sigh'] as BreathingPattern[]).map((pat) => (
            <button
              key={pat}
              onClick={() => setSelectedPattern(pat)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                selectedPattern === pat
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a2030]'
              }`}
            >
              {pat === 'box'
                ? 'Box (4-4-4-4)'
                : pat === 'calm-478'
                ? '4-7-8 Calm'
                : pat === 'coherent-55'
                ? '5-5 Coherent'
                : 'Tactical Sigh'}
            </button>
          ))}
        </div>

        {/* Duration selector */}
        <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-lg border border-[#1e2536]">
          {DURATIONS.map((dur) => (
            <button
              key={dur.seconds}
              onClick={() => setTargetDuration(dur.seconds)}
              className={`px-2.5 py-1.5 rounded text-xs font-mono transition-colors ${
                targetDuration === dur.seconds
                  ? 'bg-[#222c3e] text-emerald-400 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Animated Breathing Centerpiece */}
      <div className="relative my-8 sm:my-10 flex items-center justify-center">
        {/* Subtle Ambient Glow Aura */}
        <div
          className={`absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full blur-3xl transition-opacity duration-1000 pointer-events-none ${
            isActive ? 'opacity-25 bg-emerald-500' : 'opacity-10 bg-emerald-700'
          }`}
        />

        {/* Dynamic SVG Pacer Ring */}
        <svg className="w-64 h-64 sm:w-80 sm:h-80 -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="120"
            className="stroke-[#192231] fill-none"
            strokeWidth="4"
          />
          {isActive && (
            <circle
              cx="50%"
              cy="50%"
              r="120"
              className="stroke-emerald-400 fill-none transition-all duration-1000 ease-linear"
              strokeWidth="5"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - (currentPhase.duration - phaseSecondsLeft + 1) / currentPhase.duration)}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center Animated Breathing Bubble */}
        <div
          className={`absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#152720] via-[#0f1d19] to-[#0a1411] border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/60 flex flex-col items-center justify-center text-center p-4 transition-transform duration-1000 ease-in-out ${getScaleClass()}`}
        >
          {isActive ? (
            <>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                {currentPhase.name}
              </span>
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white tabular-nums drop-shadow-md">
                {phaseSecondsLeft}s
              </span>
              <span className="text-[11px] text-gray-300 mt-2 max-w-[130px] sm:max-w-[150px] leading-tight">
                {currentPhase.cue}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-emerald-400 mb-2 animate-pulse" />
              <span className="text-sm font-bold text-white">Ready to Center</span>
              <span className="text-[11px] text-gray-400 mt-1 max-w-[130px] leading-tight">
                Press Start to begin {activePatternConfig.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Elapsed vs Target & Progress Bar */}
      <div className="w-full max-w-md space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span>Session Time: <strong className="text-white">{formatMinSec(elapsedTotal)}</strong></span>
          <span>Target: <strong className="text-white">{formatMinSec(targetDuration)}</strong> ({progressPct}%)</span>
        </div>
        <div className="h-1.5 w-full bg-[#181d28] rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{elapsedTotal > 0 ? 'Resume Breathwork' : 'Start Breathwork'}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-amber-950/50 transition-all"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#171c26] hover:bg-[#202735] border border-[#273144] rounded-lg text-gray-300 hover:text-white font-mono text-xs transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Session Complete Notification */}
      {completedNotice && (
        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-emerald-950/80 border border-emerald-700/80 rounded-lg text-emerald-300 text-xs font-mono animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Sanctuary breathwork session recorded! Mind centered for the market.</span>
        </div>
      )}
    </div>
  );
};
