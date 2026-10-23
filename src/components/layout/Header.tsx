import React, { useState, useEffect } from 'react';
import { Menu, Calculator, Plus, Clock, Globe, Sun, Moon } from 'lucide-react';
import { NavPage } from './Sidebar';
import { formatClockTime, getTimezoneOffsetString } from '../../utils/timezone';
import { ThemeMode } from '../../types';

interface HeaderProps {
  currentPage: NavPage;
  onOpenMobileMenu: () => void;
  onOpenNewTrade: () => void;
  onSelectPage: (page: NavPage) => void;
  timeZone: string;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobileMenu,
  onOpenNewTrade,
  onSelectPage,
  timeZone,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [deskTime, setDeskTime] = useState<string>('');
  const [activeSession, setActiveSession] = useState<string>('Asian');
  const [tzOffset, setTzOffset] = useState<string>('UTC+3');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDeskTime(formatClockTime(now, timeZone, true));
      setTzOffset(getTimezoneOffsetString(timeZone, now));

      // Institutional Session context based on UTC hours:
      // London: ~08:00 - 16:30 UTC
      // New York: ~13:00 - 21:00 UTC
      // London-NY Overlap: 13:00 - 17:00 UTC (The Triple Confluence golden window!)
      // Asian / Tokyo: 00:00 - 09:00 UTC
      const utcHours = now.getUTCHours();
      if (utcHours >= 13 && utcHours < 17) {
        setActiveSession('LDN–NY Overlap');
      } else if (utcHours >= 8 && utcHours < 17) {
        setActiveSession('London Session');
      } else if (utcHours >= 13 && utcHours < 21) {
        setActiveSession('New York Session');
      } else {
        setActiveSession('Asian Session');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  const getPageTitle = (page: NavPage): string => {
    switch (page) {
      case 'dashboard':
        return 'Terminal Dashboard';
      case 'charts':
        return 'Live Multi-Asset Charts';
      case 'calendar':
        return 'Economic Calendar & News Horizons';
      case 'premarket':
        return 'Premarket Routine (5-Step Protocol)';
      case 'sanctuary':
        return 'The Sanctuary — Mindset & Breathwork';
      case 'strategy':
        return 'Triple Confluence Strategy';
      case 'rules':
        return 'Discretionary Trading Rules';
      case 'journal':
        return 'Trade Journal & Analytics';
      case 'charting':
        return 'Structured Charting Process';
      case 'calculator':
        return 'Position Size & Risk Calculator';
      case 'settings':
        return 'Settings, Backup & Privacy';
      default:
        return 'Edge Trader';
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#0c0e13] border-b border-[#1c222e] flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger + Page Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-[#181d28] rounded-md transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 hidden sm:inline font-mono">EDGE TRADER /</span>
          <h1 className="text-sm font-semibold text-white tracking-wide">
            {getPageTitle(currentPage)}
          </h1>
        </div>
      </div>

      {/* Right: Market Session & UTC Clock + Action buttons */}
      <div className="flex items-center gap-3">
        {/* Desk Time & Market Session */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#131720] border border-[#202736] rounded-md text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-gray-200 tabular-nums">{deskTime}</span>
          <span className="text-gray-400 text-[10px] uppercase font-bold">{tzOffset}</span>
          <span className="text-gray-600">·</span>
          <span
            className={`font-semibold ${
              activeSession.includes('Overlap')
                ? 'text-emerald-400'
                : activeSession.includes('London') || activeSession.includes('New York')
                ? 'text-sky-400'
                : 'text-gray-400'
            }`}
          >
            {activeSession}
          </span>
        </div>

        {/* Quick Calculator Shortcut */}
        <button
          onClick={() => onSelectPage('calculator')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#fffefe] hover:bg-[#1d2332] border border-[#232b3b] rounded-md transition-colors"
          title="Open Risk Calculator"
        >
          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
          <span>Risk Calc</span>
        </button>

        {/* Quick Theme Toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center p-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#151a24] hover:bg-[#1d2332] border border-[#232b3b] rounded-md transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-pink-400" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-400" />
            )}
          </button>
        )}

        {/* Primary Action Button */}
        <button
          onClick={onOpenNewTrade}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Log Trade</span>
        </button>
      </div>
    </header>
  );
};
