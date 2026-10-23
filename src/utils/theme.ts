/**
 * Tab Accent Color & Theme Mode Utilities for Edge Trader
 * Supports independent tab accent color customization (pink, green, blue, purple, orange, red)
 * and theme mode storage (light, dark).
 */

export type TabAccentColor = 'pink' | 'green' | 'blue' | 'purple' | 'orange' | 'red';
export type ThemeMode = 'light' | 'dark';

export interface TabColorConfig {
  id: TabAccentColor;
  name: string;
  hex: string;
  // Sidebar styling
  sidebarBrandBar: string;
  sidebarSubtext: string;
  sidebarActiveNav: string;
  sidebarActiveText: string;
  sidebarActiveBorder: string;
  sidebarActiveIcon: string;
  // Button & badge styling
  primaryBtn: string;
  badge: string;
  borderAccent: string;
  // Horizontal tab styling
  activeTabBtn: string;
  // Contextual accents
  textAccent: string;
  bgSubtle: string;
  progressFill: string;
  ringAccent: string;
}

export const TAB_COLOR_PRESETS: Record<TabAccentColor, TabColorConfig> = {
  pink: {
    id: 'pink',
    name: 'Pink (Rose / Fuchsia)',
    hex: '#ec4899',
    sidebarBrandBar: 'bg-pink-500',
    sidebarSubtext: 'text-pink-600 dark:text-pink-400',
    sidebarActiveNav: 'bg-pink-50 text-pink-700 font-semibold border-l-2 border-pink-500 dark:bg-pink-950/40 dark:text-pink-400',
    sidebarActiveText: 'text-pink-700 dark:text-pink-400',
    sidebarActiveBorder: 'border-pink-500',
    sidebarActiveIcon: 'text-pink-600 dark:text-pink-400',
    primaryBtn: 'bg-pink-600 hover:bg-pink-500 text-white',
    badge: 'bg-pink-500/10 text-pink-700 dark:text-pink-400 border border-pink-500/30',
    borderAccent: 'border-pink-500',
    activeTabBtn: 'bg-pink-600 text-white shadow-xs',
    textAccent: 'text-pink-600 dark:text-pink-400',
    bgSubtle: 'bg-pink-500/10',
    progressFill: 'bg-pink-500',
    ringAccent: 'focus:border-pink-500 focus:ring-pink-500',
  },
  green: {
    id: 'green',
    name: 'Green (Emerald)',
    hex: '#10b981',
    sidebarBrandBar: 'bg-emerald-500',
    sidebarSubtext: 'text-emerald-600 dark:text-emerald-400',
    sidebarActiveNav: 'bg-emerald-50 text-emerald-800 font-semibold border-l-2 border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400',
    sidebarActiveText: 'text-emerald-800 dark:text-emerald-400',
    sidebarActiveBorder: 'border-emerald-500',
    sidebarActiveIcon: 'text-emerald-600 dark:text-emerald-400',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    badge: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30',
    borderAccent: 'border-emerald-500',
    activeTabBtn: 'bg-emerald-600 text-white shadow-xs',
    textAccent: 'text-emerald-600 dark:text-emerald-400',
    bgSubtle: 'bg-emerald-500/10',
    progressFill: 'bg-emerald-500',
    ringAccent: 'focus:border-emerald-500 focus:ring-emerald-500',
  },
  blue: {
    id: 'blue',
    name: 'Blue (Cobalt)',
    hex: '#3b82f6',
    sidebarBrandBar: 'bg-blue-500',
    sidebarSubtext: 'text-blue-600 dark:text-blue-400',
    sidebarActiveNav: 'bg-blue-50 text-blue-800 font-semibold border-l-2 border-blue-500 dark:bg-blue-950/40 dark:text-blue-400',
    sidebarActiveText: 'text-blue-800 dark:text-blue-400',
    sidebarActiveBorder: 'border-blue-500',
    sidebarActiveIcon: 'text-blue-600 dark:text-blue-400',
    primaryBtn: 'bg-blue-600 hover:bg-blue-500 text-white',
    badge: 'bg-blue-500/10 text-blue-800 dark:text-blue-400 border border-blue-500/30',
    borderAccent: 'border-blue-500',
    activeTabBtn: 'bg-blue-600 text-white shadow-xs',
    textAccent: 'text-blue-600 dark:text-blue-400',
    bgSubtle: 'bg-blue-500/10',
    progressFill: 'bg-blue-500',
    ringAccent: 'focus:border-blue-500 focus:ring-blue-500',
  },
  purple: {
    id: 'purple',
    name: 'Purple (Violet)',
    hex: '#a855f7',
    sidebarBrandBar: 'bg-purple-500',
    sidebarSubtext: 'text-purple-600 dark:text-purple-400',
    sidebarActiveNav: 'bg-purple-50 text-purple-800 font-semibold border-l-2 border-purple-500 dark:bg-purple-950/40 dark:text-purple-400',
    sidebarActiveText: 'text-purple-800 dark:text-purple-400',
    sidebarActiveBorder: 'border-purple-500',
    sidebarActiveIcon: 'text-purple-600 dark:text-purple-400',
    primaryBtn: 'bg-purple-600 hover:bg-purple-500 text-white',
    badge: 'bg-purple-500/10 text-purple-800 dark:text-purple-400 border border-purple-500/30',
    borderAccent: 'border-purple-500',
    activeTabBtn: 'bg-purple-600 text-white shadow-xs',
    textAccent: 'text-purple-600 dark:text-purple-400',
    bgSubtle: 'bg-purple-500/10',
    progressFill: 'bg-purple-500',
    ringAccent: 'focus:border-purple-500 focus:ring-purple-500',
  },
  orange: {
    id: 'orange',
    name: 'Orange (Amber)',
    hex: '#f97316',
    sidebarBrandBar: 'bg-orange-500',
    sidebarSubtext: 'text-orange-600 dark:text-orange-400',
    sidebarActiveNav: 'bg-orange-50 text-orange-800 font-semibold border-l-2 border-orange-500 dark:bg-orange-950/40 dark:text-orange-400',
    sidebarActiveText: 'text-orange-800 dark:text-orange-400',
    sidebarActiveBorder: 'border-orange-500',
    sidebarActiveIcon: 'text-orange-600 dark:text-orange-400',
    primaryBtn: 'bg-orange-600 hover:bg-orange-500 text-white',
    badge: 'bg-orange-500/10 text-orange-800 dark:text-orange-400 border border-orange-500/30',
    borderAccent: 'border-orange-500',
    activeTabBtn: 'bg-orange-600 text-white shadow-xs',
    textAccent: 'text-orange-600 dark:text-orange-400',
    bgSubtle: 'bg-orange-500/10',
    progressFill: 'bg-orange-500',
    ringAccent: 'focus:border-orange-500 focus:ring-orange-500',
  },
  red: {
    id: 'red',
    name: 'Red (Crimson)',
    hex: '#ef4444',
    sidebarBrandBar: 'bg-rose-500',
    sidebarSubtext: 'text-rose-600 dark:text-rose-400',
    sidebarActiveNav: 'bg-rose-50 text-rose-800 font-semibold border-l-2 border-rose-500 dark:bg-rose-950/40 dark:text-rose-400',
    sidebarActiveText: 'text-rose-800 dark:text-rose-400',
    sidebarActiveBorder: 'border-rose-500',
    sidebarActiveIcon: 'text-rose-600 dark:text-rose-400',
    primaryBtn: 'bg-rose-600 hover:bg-rose-500 text-white',
    badge: 'bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-500/30',
    borderAccent: 'border-rose-500',
    activeTabBtn: 'bg-rose-600 text-white shadow-xs',
    textAccent: 'text-rose-600 dark:text-rose-400',
    bgSubtle: 'bg-rose-500/10',
    progressFill: 'bg-rose-500',
    ringAccent: 'focus:border-rose-500 focus:ring-rose-500',
  },
};

export const TAB_COLOR_LIST: TabColorConfig[] = [
  TAB_COLOR_PRESETS.pink,
  TAB_COLOR_PRESETS.green,
  TAB_COLOR_PRESETS.blue,
  TAB_COLOR_PRESETS.purple,
  TAB_COLOR_PRESETS.orange,
  TAB_COLOR_PRESETS.red,
];

export const STORAGE_KEYS_THEME = {
  TAB_COLOR: 'edge_trader_tab_color_v1',
  THEME_MODE: 'edge_trader_theme_mode_v1',
};

// Default to Light Desk with Pink accents to immediately satisfy user request while preserving full customizability
export const DEFAULT_TAB_COLOR: TabAccentColor = 'pink';
export const DEFAULT_THEME_MODE: ThemeMode = 'light';

export function getTabColorConfig(color?: string): TabColorConfig {
  if (color && color in TAB_COLOR_PRESETS) {
    return TAB_COLOR_PRESETS[color as TabAccentColor];
  }
  return TAB_COLOR_PRESETS[DEFAULT_TAB_COLOR];
}

export function getStoredTabColor(): TabAccentColor {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS_THEME.TAB_COLOR);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (['pink', 'green', 'blue', 'purple', 'orange', 'red'].includes(parsed)) {
        return parsed as TabAccentColor;
      }
    }
  } catch {
    // Fallback
  }
  return DEFAULT_TAB_COLOR;
}

export function saveStoredTabColor(color: TabAccentColor): void {
  try {
    localStorage.setItem(STORAGE_KEYS_THEME.TAB_COLOR, JSON.stringify(color));
  } catch (err) {
    console.error('Error saving tab accent color to localStorage:', err);
  }
}

export function getStoredThemeMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS_THEME.THEME_MODE);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed === 'dark' || parsed === 'light') {
        return parsed as ThemeMode;
      }
    }
  } catch {
    // Fallback
  }
  return DEFAULT_THEME_MODE;
}

export function saveStoredThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS_THEME.THEME_MODE, JSON.stringify(mode));
  } catch (err) {
    console.error('Error saving theme mode to localStorage:', err);
  }
}
