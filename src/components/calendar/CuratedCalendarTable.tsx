import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Filter,
  Search,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { EconomicEvent, ImpactLevel } from '../../types';
import {
  VERIFIED_MACRO_SCHEDULE,
  EconomicFilters,
  filterEconomicEvents,
} from '../../utils/economicEvents';
import {
  formatDateTime,
  formatDateDisplay,
  formatClockTime,
  getTimezoneOffsetString,
} from '../../utils/timezone';

interface CuratedCalendarTableProps {
  timeZone: string;
  onOpenTradingViewLive?: () => void;
}

export const CuratedCalendarTable: React.FC<CuratedCalendarTableProps> = ({
  timeZone,
  onOpenTradingViewLive,
}) => {
  const [filters, setFilters] = useState<EconomicFilters>({
    impact: 'All',
    currency: 'All',
    searchQuery: '',
  });

  const filteredEvents = useMemo(() => {
    return filterEconomicEvents(VERIFIED_MACRO_SCHEDULE, filters);
  }, [filters]);

  const offsetString = useMemo(() => {
    return getTimezoneOffsetString(timeZone);
  }, [timeZone]);

  const getImpactBadge = (impact: ImpactLevel) => {
    switch (impact) {
      case 'High':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-950/80 text-red-400 border border-red-800/60">
            HIGH IMPACT
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-950/80 text-amber-400 border border-amber-800/60">
            MED IMPACT
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
            LOW IMPACT
          </span>
        );
      default:
        return null;
    }
  };

  const getCurrencyColor = (curr: string) => {
    switch (curr) {
      case 'USD':
        return 'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';
      case 'EUR':
        return 'text-blue-400 border-blue-800/60 bg-blue-950/40';
      case 'GBP':
        return 'text-violet-400 border-violet-800/60 bg-violet-950/40';
      case 'JPY':
        return 'text-rose-400 border-rose-800/60 bg-rose-950/40';
      default:
        return 'text-gray-300 border-gray-700 bg-gray-800/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Transparency & Integrity Banner */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Verified Institutional Macro Timetable</span>
                <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800/60 px-1.5 py-0.2 rounded font-mono">
                  IANA DST COMPLIANT
                </span>
              </div>
              <p className="text-gray-400 mt-0.5 leading-relaxed">
                Release times are converted to your selected timezone{' '}
                <strong className="text-gray-200 font-mono">
                  {timeZone} ({offsetString})
                </strong>
                . Automatically accounts for daylight saving time shifts across London and New York.
              </p>
            </div>
          </div>

          {onOpenTradingViewLive && (
            <button
              onClick={onOpenTradingViewLive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171c26] hover:bg-[#202735] border border-[#273144] rounded text-gray-200 hover:text-white font-mono text-xs transition-colors shrink-0"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Switch to Live Feed</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Impact and Currency Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Impact Filter */}
          <div className="flex items-center bg-[#141822] p-0.5 rounded border border-[#222938] text-xs">
            {(['All', 'High', 'Medium'] as const).map((imp) => (
              <button
                key={imp}
                onClick={() => setFilters((f) => ({ ...f, impact: imp }))}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  filters.impact === imp
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {imp === 'All' ? 'All Impacts' : `${imp} Impact`}
              </button>
            ))}
          </div>

          {/* Currency Filter */}
          <div className="flex items-center bg-[#141822] p-0.5 rounded border border-[#222938] text-xs">
            {(['All', 'USD', 'EUR', 'GBP', 'JPY'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setFilters((f) => ({ ...f, currency: curr }))}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  filters.currency === curr
                    ? 'bg-[#252d3d] text-emerald-400 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search Box */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((f) => ({ ...f, searchQuery: e.target.value }))}
            placeholder="Search event, currency, source..."
            className="w-full bg-[#12151f] border border-[#202736] focus:border-emerald-500 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-400 font-mono outline-hidden"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1b2230] bg-[#121622] text-[11px] font-mono uppercase tracking-wider text-gray-400">
                <th className="py-2.5 px-4 font-medium">Scheduled Time ({timeZone})</th>
                <th className="py-2.5 px-3 font-medium">Currency</th>
                <th className="py-2.5 px-3 font-medium">Impact</th>
                <th className="py-2.5 px-4 font-medium">Economic Event & Official Source</th>
                <th className="py-2.5 px-3 font-medium text-right">Forecast</th>
                <th className="py-2.5 px-3 font-medium text-right">Previous</th>
                <th className="py-2.5 px-4 font-medium text-right">Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171d28] text-xs">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-mono">
                    No economic releases match the selected impact or currency filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const localDateStr = formatDateDisplay(evt.datetimeUtc, timeZone);
                  const localTimeStr = formatClockTime(evt.datetimeUtc, timeZone, false);

                  return (
                    <tr
                      key={evt.id}
                      className="hover:bg-[#131722] transition-colors group"
                    >
                      {/* Scheduled Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-white font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{localTimeStr}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                          {localDateStr}
                        </div>
                      </td>

                      {/* Currency */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold border ${getCurrencyColor(
                            evt.currency
                          )}`}
                        >
                          {evt.currency}
                        </span>
                      </td>

                      {/* Impact */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getImpactBadge(evt.impact)}
                      </td>

                      {/* Event Title & Source */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-100 group-hover:text-emerald-300 transition-colors">
                          {evt.title}
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-gray-400">Source:</span>
                          <span className="font-mono text-gray-400">{evt.source}</span>
                          {evt.period && (
                            <>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-400 font-mono">Period: {evt.period}</span>
                            </>
                          )}
                        </div>
                        {evt.notes && (
                          <div className="text-[11px] text-gray-400 mt-1 max-w-xl italic">
                            {evt.notes}
                          </div>
                        )}
                      </td>

                      {/* Forecast */}
                      <td className="py-3 px-3 text-right font-mono text-gray-300">
                        {evt.forecast || '—'}
                      </td>

                      {/* Previous */}
                      <td className="py-3 px-3 text-right font-mono text-gray-400">
                        {evt.previous || '—'}
                      </td>

                      {/* Actual */}
                      <td className="py-3 px-4 text-right font-mono">
                        {evt.actual ? (
                          <span className="text-emerald-400 font-bold">{evt.actual}</span>
                        ) : (
                          <span className="text-gray-400 text-[11px] italic">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Attribution & Disclosure Footer */}
        <div className="p-3 bg-[#0c0f16] border-t border-[#181d28] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-gray-400 font-mono">
          <div>
            Showing {filteredEvents.length} scheduled benchmark releases · Last audited: Oct 2026
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            <span>Never trade through high-impact red folder news without confirmed MSS.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
