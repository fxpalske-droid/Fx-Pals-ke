import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  Calendar,
  Compass,
  ScrollText,
  ListCheck,
  BookOpen,
  Crosshair,
  Calculator,
  Sparkles,
  Settings,
  PlusCircle,
  X,
} from 'lucide-react';

import { TabAccentColor, ThemeMode, getTabColorConfig } from '../../utils/theme';

export type NavPage =
  | 'dashboard'
  | 'charts'
  | 'calendar'
  | 'premarket'
  | 'sanctuary'
  | 'strategy'
  | 'rules'
  | 'journal'
  | 'charting'
  | 'calculator'
  | 'settings';

interface SidebarProps {
  currentPage: NavPage;
  onSelectPage: (page: NavPage) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenNewTrade: () => void;
  tabColor?: TabAccentColor;
  themeMode?: ThemeMode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpenMobile,
  onCloseMobile,
  onOpenNewTrade,
  tabColor = 'pink',
  themeMode = 'light',
}) => {
  const colorConfig = getTabColorConfig(tabColor);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'charts', label: 'Live Charts', icon: LineChart },
    { id: 'calendar', label: 'Economic Calendar', icon: Calendar },
    { id: 'premarket', label: 'Premarket Routine', icon: ListCheck },
    { id: 'sanctuary', label: 'The Sanctuary', icon: Sparkles },
    { id: 'strategy', label: 'My Strategy', icon: Compass },
    { id: 'rules', label: 'Trading Rules', icon: ScrollText },
    { id: 'journal', label: 'Trade Journal', icon: BookOpen },
    { id: 'charting', label: 'Charting Process', icon: Crosshair },
    { id: 'calculator', label: 'Risk Calculator', icon: Calculator },
    { id: 'settings', label: 'Settings & Backup', icon: Settings },
  ] as const;

  const handleNavClick = (pageId: NavPage) => {
    onSelectPage(pageId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 ${
          themeMode === 'light'
            ? 'bg-white border-r border-gray-200 shadow-sm'
            : 'bg-[#0e1117] border-r border-[#1c222e]'
        } flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div
          className={`h-16 px-5 flex items-center justify-between border-b ${
            themeMode === 'light' ? 'border-gray-200' : 'border-[#1c222e]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-6 rounded-xs ${colorConfig.sidebarBrandBar}`} />
            <div>
              <span
                className={`text-base font-bold tracking-wider font-mono ${
                  themeMode === 'light' ? 'text-gray-900' : 'text-white'
                }`}
              >
                EDGE TRADER
              </span>
              <span
                className={`block text-[10px] uppercase tracking-widest font-mono font-semibold ${colorConfig.sidebarSubtext}`}
              >
                DISCRETIONARY DESK
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className={`lg:hidden p-1 ${
              themeMode === 'light' ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white'
            }`}
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick action button */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => {
              onOpenNewTrade();
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-xs ${colorConfig.primaryBtn}`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Trade</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-md transition-colors text-left ${
                  isActive
                    ? colorConfig.sidebarActiveNav
                    : themeMode === 'light'
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-[#141822]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? colorConfig.sidebarActiveIcon
                      : themeMode === 'light'
                      ? 'text-gray-500'
                      : 'text-gray-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info / discipline */}
        <div
          className={`p-4 border-t ${
            themeMode === 'light'
              ? 'border-gray-200 bg-gray-50'
              : 'border-[#1c222e] bg-[#0b0e14]'
          }`}
        >
          <div
            className={`text-[11px] font-mono mb-1 ${
              themeMode === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            DISCIPLINE PRINCIPLE
          </div>
          <div
            className={`text-xs font-medium italic ${
              themeMode === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}
          >
            &ldquo;No confirmation, no entry.&rdquo;
          </div>
          <div
            className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] ${
              themeMode === 'light'
                ? 'border-gray-200 text-gray-500'
                : 'border-[#1a202c] text-gray-400'
            }`}
          >
            <span>Storage: Local</span>
            <span className={`font-mono ${colorConfig.sidebarSubtext}`}>100% Private</span>
          </div>
        </div>
      </aside>
    </>
  );
};
