import React from 'react';
import { History, Clock, Wind, Trash2, Award } from 'lucide-react';
import { SanctuarySession } from '../../types';
import { formatDateTime, getTimezoneOffsetString } from '../../utils/timezone';

interface SanctuaryHistoryProps {
  sessions: SanctuarySession[];
  timeZone: string;
  onClearHistory: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export const SanctuaryHistory: React.FC<SanctuaryHistoryProps> = ({
  sessions,
  timeZone,
  onClearHistory,
  onDeleteSession,
}) => {
  const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  const patternLabels: Record<string, string> = {
    box: 'Box Breathing (4-4-4-4)',
    'calm-478': '4-7-8 Deep Calm',
    'coherent-55': '5-5 Coherent',
    'tactical-sigh': 'Tactical Sigh',
  };

  return (
    <div className="bg-[#0e121a] border border-[#1b2230] rounded-xl p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#181d28]">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <History className="w-4 h-4" />
          <span>SANCTUARY MINDFULNESS LOG</span>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[11px] font-mono text-gray-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-[#121622] border border-[#1e2536] p-3 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-gray-400 block">Total Centering</span>
          <span className="text-xl font-bold font-mono text-white">{totalMinutes}</span>
          <span className="text-xs text-gray-400 ml-1">minutes</span>
        </div>

        <div className="bg-[#121622] border border-[#1e2536] p-3 rounded-lg">
          <span className="text-[10px] font-mono uppercase text-gray-400 block">Sessions Completed</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{sessions.length}</span>
          <span className="text-xs text-gray-400 ml-1">sessions</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-[#121622] border border-[#1e2536] p-3 rounded-lg flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block">Mental Edge</span>
            <span className="text-xs font-bold text-white">Discipline Focus</span>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="py-8 text-center text-xs font-mono text-gray-400 bg-[#121622]/50 border border-dashed border-[#1e2536] rounded-lg">
          No breathwork sessions completed yet. Practice 3 minutes of Box Breathing before your next session.
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {sessions.slice(0, 10).map((session) => {
            const formattedTime = formatDateTime(session.completedAtUtc, timeZone, true);
            const minutes = Math.round(session.durationSeconds / 60);

            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-[#121622] border border-[#1c2333] rounded-lg text-xs hover:border-[#283348] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#192232] flex items-center justify-center text-emerald-400 shrink-0">
                    <Wind className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {patternLabels[session.pattern] || session.pattern}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{formattedTime}</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-semibold">{minutes} min ({session.durationSeconds}s)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="text-gray-400 hover:text-rose-400 p-1.5 rounded transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
