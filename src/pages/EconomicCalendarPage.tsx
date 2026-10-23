import React, { useState } from 'react';
import {
  Calendar,
  Radio,
  Clock,
  ExternalLink,
  ShieldAlert,
  Info,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { EconomicCalendarWidget } from '../components/calendar/EconomicCalendarWidget';
import { CuratedCalendarTable } from '../components/calendar/CuratedCalendarTable';
import { TRUSTED_EXTERNAL_CALENDARS } from '../utils/economicEvents';
import { getTimezoneOffsetString } from '../utils/timezone';
import { NavPage } from '../components/layout/Sidebar';

import { ThemeMode } from '../types';

interface EconomicCalendarPageProps {
  timeZone: string;
  onNavigate?: (page: NavPage) => void;
  theme?: ThemeMode;
}

export const EconomicCalendarPage: React.FC<EconomicCalendarPageProps> = ({
  timeZone,
  onNavigate,
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'schedule' | 'external'>('live');
  const offsetString = getTimezoneOffsetString(timeZone);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <Calendar className="w-4 h-4" />
            <span>MACROECONOMIC INTELLIGENCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Economic Calendar & News Horizons
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Live institutional economic data stream and structured high-impact event schedule.
            Track high-volatility catalysts for Forex pairs and Gold (XAUUSD).
          </p>
        </div>

        {/* Selected Timezone Badge & Quick Premarket Nav */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3 py-2 bg-[#141822] border border-[#222a3a] rounded-md text-xs font-mono">
            <span className="text-gray-400 block text-[10px] uppercase">Active Timezone</span>
            <span className="text-white font-semibold">{timeZone}</span>{' '}
            <span className="text-emerald-400 font-bold">({offsetString})</span>
          </div>

          {onNavigate && (
            <button
              onClick={() => onNavigate('premarket')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-[#ffffff] hover:bg-[#1a2536] border border-emerald-900/60 rounded-md transition-colors"
            >
              <span>Premarket Step 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1b2230] pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold transition-colors ${
            activeTab === 'live'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-400 hover:text-white bg-[#131722]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live TradingView Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold transition-colors ${
            activeTab === 'schedule'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-400 hover:text-white bg-[#131722]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Verified High-Impact Schedule</span>
        </button>

        <button
          onClick={() => setActiveTab('external')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold transition-colors ${
            activeTab === 'external'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-400 hover:text-white bg-[#131722]'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>External Verified Portals</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          <EconomicCalendarWidget height={680} theme={theme} />

          <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg p-4 text-xs text-gray-400">
            <h4 className="font-semibold text-gray-200 mb-1 flex items-center gap-1.5 font-mono">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>Live Data Feed Architecture</span>
            </h4>
            <p className="leading-relaxed">
              This live feed is directly embedded from TradingView&apos;s institutional calendar system.
              Real-time economic releases (CPI, Nonfarm Payrolls, Central Bank rates) stream automatically
              from primary statistical bureaus without manual refreshing.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <CuratedCalendarTable
          timeZone={timeZone}
          onOpenTradingViewLive={() => setActiveTab('live')}
        />
      )}

      {activeTab === 'external' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRUSTED_EXTERNAL_CALENDARS.map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#0e121a] hover:bg-[#131824] border border-[#1b2230] hover:border-emerald-700/60 rounded-lg p-5 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#182030] text-emerald-400 border border-emerald-900/50">
                      {portal.badge}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mt-2 flex items-center gap-1.5">
                      <span>{portal.name}</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {portal.description}
                </p>
                <div className="mt-4 pt-3 border-t border-[#171c26] text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span>Open calendar in new tab</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>

          {/* Explanation on automated live feeds */}
          <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 text-xs text-gray-400 space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-2 text-sm font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Data Sourcing Policy & Live Feeds</span>
            </h4>
            <p className="leading-relaxed">
              Standard forex brokers and retail applications do not possess proprietary live economic feeds;
              genuine real-time machine-readable JSON feeds (such as Bloomberg Enterprise, Refinitiv, or ForexFactory JSON)
              require paid corporate subscriptions and strict redistribution licensing.
            </p>
            <p className="leading-relaxed text-gray-400">
              In accordance with Edge Trader&apos;s integrity principles, this workspace never fabricates, estimates,
              or hallucinate release figures. We integrate TradingView&apos;s official live iframe stream alongside
              curated benchmark release schedules and direct links to established market authorities.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
