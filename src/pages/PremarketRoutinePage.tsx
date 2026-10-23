import React, { useState } from 'react';
import {
  ListCheck,
  RotateCcw,
  Camera,
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Calculator,
  Compass,
  LineChart,
} from 'lucide-react';
import { PremarketSnapshot, PremarketStep } from '../types';
import { DEFAULT_PREMARKET_STEPS } from '../utils/storage';
import { formatClockTime, formatDateDisplay, getTimezoneOffsetString } from '../utils/timezone';
import { NavPage } from '../components/layout/Sidebar';
import { CuratedCalendarTable } from '../components/calendar/CuratedCalendarTable';
import { TabAccentColor, getTabColorConfig } from '../utils/theme';

interface PremarketRoutinePageProps {
  completedStepIds: string[];
  notes: string;
  snapshots: PremarketSnapshot[];
  timeZone: string;
  onToggleStep: (stepId: string) => void;
  onUpdateNotes: (notes: string) => void;
  onResetToday: () => void;
  onSaveSnapshot: (snapshot: PremarketSnapshot) => void;
  onDeleteSnapshot: (snapshotId: string) => void;
  onNavigate?: (page: NavPage) => void;
  tabColor?: TabAccentColor;
}

export const PremarketRoutinePage: React.FC<PremarketRoutinePageProps> = ({
  completedStepIds,
  notes,
  snapshots,
  timeZone,
  onToggleStep,
  onUpdateNotes,
  onResetToday,
  onSaveSnapshot,
  onDeleteSnapshot,
  onNavigate,
  tabColor = 'pink',
}) => {
  const colorConfig = getTabColorConfig(tabColor);
  const [snapshotSavedNotice, setSnapshotSavedNotice] = useState(false);
  const [isCalendarPreviewOpen, setIsCalendarPreviewOpen] = useState(false);

  const steps: PremarketStep[] = DEFAULT_PREMARKET_STEPS;
  const totalSteps = steps.length;
  const completedCount = steps.filter((s) => completedStepIds.includes(s.id)).length;
  const progressPct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
  const isAllCompleted = completedCount === totalSteps;

  const handleTakeSnapshot = () => {
    const now = new Date();
    const todayInTz = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);

    const savedAtStr = `${formatClockTime(now, timeZone, true)} (${getTimezoneOffsetString(timeZone)})`;

    const newSnapshot: PremarketSnapshot = {
      id: `snapshot_${Date.now()}`,
      date: todayInTz,
      savedAt: savedAtStr,
      completedIds: [...completedStepIds],
      totalSteps,
      notes,
      readinessScore: progressPct,
    };

    onSaveSnapshot(newSnapshot);
    setSnapshotSavedNotice(true);
    setTimeout(() => setSnapshotSavedNotice(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset premarket checklist for a new trading day?')) {
      onResetToday();
    }
  };

  // Icon helper per step
  const getStepIcon = (page?: string) => {
    switch (page) {
      case 'calendar':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'strategy':
        return <Compass className="w-4 h-4 text-blue-400" />;
      case 'charts':
        return <LineChart className="w-4 h-4 text-purple-400" />;
      case 'calculator':
        return <Calculator className="w-4 h-4 text-emerald-400" />;
      case 'sanctuary':
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className={`flex items-center gap-2 text-xs ${colorConfig.textAccent} font-mono mb-1`}>
            <ListCheck className="w-4 h-4" />
            <span>SESSION READINESS PROTOCOL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Premarket Routine
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
            A 5-step checklist to prepare for the session with focus, calculated risk, and zero emotional bias.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-[#151a24] hover:bg-[#1a2130] border border-[#232b3c] rounded-md transition-colors"
            title="Reset checklist for a new trading day"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>Reset for New Day</span>
          </button>

          <button
            onClick={handleTakeSnapshot}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors shadow-xs ${colorConfig.primaryBtn}`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Save Today&apos;s Snapshot</span>
          </button>
        </div>
      </div>

      {/* Snapshot Saved Alert */}
      {snapshotSavedNotice && (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-md p-3.5 flex items-center justify-between text-xs text-emerald-300 font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Snapshot archived successfully for today&apos;s records.</span>
          </div>
          <span className="text-[10px] text-emerald-500">Auto-dismissing</span>
        </div>
      )}

      {/* Progress Card */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
              Premarket Progress:
            </span>
            <span className={`text-sm font-bold font-mono ${colorConfig.textAccent}`}>
              {completedCount}/{totalSteps} completed
            </span>
            <span className="text-xs text-gray-500 font-mono">({progressPct}%)</span>
          </div>

          <div>
            {isAllCompleted ? (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold ${colorConfig.badge} rounded-full font-mono`}>
                <CheckCircle2 className={`w-3.5 h-3.5 ${colorConfig.textAccent}`} />
                All Steps Verified — Ready to Trade
              </span>
            ) : (
              <span className="text-xs text-gray-400 font-mono">
                {totalSteps - completedCount} {totalSteps - completedCount === 1 ? 'step' : 'steps'} remaining
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#181f2c] rounded-full h-2.5 overflow-hidden">
          <div
            className={`${colorConfig.progressFill} h-full rounded-full transition-all duration-300`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* The 5 Checklist Items */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg divide-y divide-[#181f2c]">
        {steps.map((step, idx) => {
          const isChecked = completedStepIds.includes(step.id);
          const isEconomicCalendar = step.id === 'step-calendar';

          return (
            <div
              key={step.id}
              className={`p-4 sm:p-5 transition-colors ${
                isChecked ? `${colorConfig.bgSubtle}` : 'hover:bg-[#131822]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Single Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleStep(step.id)}
                  className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                    isChecked
                      ? `${colorConfig.primaryBtn} border-transparent shadow-xs`
                      : 'bg-white dark:bg-[#151a24] border-gray-300 dark:border-[#2a3447] text-transparent hover:border-pink-500/60'
                  }`}
                  aria-label={`Mark ${step.title} as ${isChecked ? 'incomplete' : 'complete'}`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isChecked ? 'opacity-100 text-white' : 'opacity-0'}`} />
                </button>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {idx + 1}.
                      </span>
                      <h3
                        onClick={() => onToggleStep(step.id)}
                        className={`text-sm sm:text-base font-semibold cursor-pointer select-none transition-colors ${
                          isChecked ? 'text-gray-300 line-through decoration-emerald-500/50' : 'text-white'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Quick Access Action Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isEconomicCalendar && (
                        <button
                          type="button"
                          onClick={() => setIsCalendarPreviewOpen(!isCalendarPreviewOpen)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-[#fffdfd] hover:bg-amber-900/40 border border-amber-800/40 rounded transition-colors"
                        >
                          <Calendar className="w-3 h-3 text-[#ff3063]" />
                          <span className="bg-[#f8f5f5] text-[#1e1e1d] px-1 rounded-xs">
                            {isCalendarPreviewOpen ? 'Hide Inline' : 'Preview Releases'}
                          </span>
                          {isCalendarPreviewOpen ? (
                            <ChevronUp className="w-3 h-3 text-[#ff306f]" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-[#ff306f]" />
                          )}
                        </button>
                      )}

                      {step.actionPage && onNavigate && (
                        <button
                          type="button"
                          onClick={() => onNavigate(step.actionPage as NavPage)}
                          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-300 hover:text-emerald-200 ${
                            idx === 0
                              ? 'bg-[#fffefe]'
                              : idx === 1
                              ? 'bg-[#feffff]'
                              : idx === 2
                              ? 'bg-[#fbfdff]'
                              : idx === 3
                              ? 'bg-[#feffff]'
                              : 'bg-[#ffffff]'
                          } hover:bg-[#1a2534] border border-[#233146] hover:border-emerald-800/50 rounded transition-colors`}
                        >
                          {getStepIcon(step.actionPage)}
                          <span>{step.actionLabel || 'Open'}</span>
                          <ArrowRight className="w-3 h-3 text-emerald-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Inline Economic Calendar Access if expanded */}
                  {isEconomicCalendar && isCalendarPreviewOpen && (
                    <div className="mt-4 pt-3 border-t border-[#1e2533]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Upcoming Releases in {timeZone}
                        </span>
                        {onNavigate && (
                          <button
                            type="button"
                            onClick={() => onNavigate('calendar')}
                            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            Full Calendar Page <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      <div className="border border-[#1e2533] rounded-md overflow-hidden bg-[#0a0d13]">
                        <CuratedCalendarTable timeZone={timeZone} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Premarket Notes */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
        <label
          htmlFor="premarket-notes"
          className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2 font-medium"
        >
          Premarket Notes &amp; Session Intentions
        </label>
        <textarea
          id="premarket-notes"
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="E.g., Waiting for London Open liquidity sweep on EURUSD. Invalidation above 1.0920. Risk locked at 0.75%. Staying patient."
          rows={3}
          className="w-full bg-[#0b0e14] border border-[#1e2533] rounded-md px-3.5 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-hidden focus:border-emerald-500 font-mono transition-colors"
        />
        <p className="text-[11px] text-gray-500 font-mono mt-1">
          Notes automatically persist in localStorage and are archived with daily snapshots.
        </p>
      </div>

      {/* Saved Snapshots History */}
      {snapshots.length > 0 && (
        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Premarket Routine History</span>
            <span className="text-xs font-mono text-gray-400 font-normal">
              ({snapshots.length} saved)
            </span>
          </h3>

          <div className="space-y-2.5">
            {snapshots.slice(0, 5).map((snap) => (
              <div
                key={snap.id}
                className="bg-[#0b0e14] border border-[#1e2533] rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{snap.date}</span>
                      <span className="text-[11px] text-gray-500 font-mono">{snap.savedAt}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      Completed {snap.completedIds.length}/{snap.totalSteps} steps ({snap.readinessScore ?? 100}%)
                      {snap.notes && <span className="text-gray-500 italic"> — &ldquo;{snap.notes.slice(0, 50)}...&rdquo;</span>}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteSnapshot(snap.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors self-end sm:self-center"
                  title="Delete snapshot"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
