import React, { useRef, useState, useMemo } from 'react';
import {
  Settings,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  HardDrive,
  Lock,
  FileSpreadsheet,
  CheckCircle2,
  Info,
  Globe,
  Clock,
  Search,
  Palette,
  Sun,
  Moon,
} from 'lucide-react';
import { AppDataBackup, ThemeMode, TradeEntry } from '../types';
import {
  exportTradesToCSV,
  exportFullBackupJSON,
  importBackupJSON,
} from '../utils/storage';
import {
  SUPPORTED_TIMEZONES,
  getTimezoneOffsetString,
  formatDateTime,
  formatClockTime,
  isValidTimezone,
} from '../utils/timezone';

interface SettingsPageProps {
  trades: TradeEntry[];
  accountBalance: number;
  defaultRiskPct: number;
  timeZone: string;
  theme: ThemeMode;
  onUpdateBalance: (bal: number) => void;
  onUpdateRisk: (risk: number) => void;
  onUpdateTimezone: (tz: string) => void;
  onUpdateTheme: (theme: ThemeMode) => void;
  onDataRestored: () => void;
  onRequestClearAll: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  trades,
  accountBalance,
  defaultRiskPct,
  timeZone,
  theme,
  onUpdateBalance,
  onUpdateRisk,
  onUpdateTimezone,
  onUpdateTheme,
  onDataRestored,
  onRequestClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tzSearchQuery, setTzSearchQuery] = useState('');
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const currentOffset = useMemo(() => {
    return getTimezoneOffsetString(timeZone);
  }, [timeZone]);

  const previewLocalTime = useMemo(() => {
    return formatDateTime(new Date(), timeZone, true);
  }, [timeZone]);

  const filteredTimezones = useMemo(() => {
    if (!tzSearchQuery.trim()) return SUPPORTED_TIMEZONES;
    const q = tzSearchQuery.toLowerCase();
    return SUPPORTED_TIMEZONES.filter(
      (tz) =>
        tz.iana.toLowerCase().includes(q) ||
        tz.label.toLowerCase().includes(q) ||
        tz.region.toLowerCase().includes(q)
    );
  }, [tzSearchQuery]);

  const primaryTradingZones = [
    'Africa/Nairobi',
    'Etc/UTC',
    'Europe/London',
    'America/New_York',
    'America/Chicago',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const result = importBackupJSON(content);
      setImportStatus(result);
      if (result.success) {
        onDataRestored();
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
          <Settings className="w-4 h-4" />
          <span>PREFERENCES & DATA MANAGEMENT</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Settings & Local Data Backup
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
          Manage local persistence, export journal records, download complete workspace snapshots, and review deployment privacy boundaries.
        </p>
      </div>

      {importStatus && (
        <div
          className={`p-4 rounded-md border flex items-start gap-3 text-xs ${
            importStatus.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {importStatus.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          )}
          <div className="leading-relaxed font-mono">{importStatus.message}</div>
        </div>
      )}

      {/* Grid: Preferences & Export/Import */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance & Theme Section */}
        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b2230]">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Appearance &amp; Theme</h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono rounded-xs border border-emerald-500/20 font-semibold">
              {theme === 'light' ? 'Light Theme Active' : 'Dark Theme Active'}
            </span>
          </div>

          <p className="text-gray-400 leading-relaxed">
            Select your preferred visual style. The theme applies immediately across all desks, charts, routines, and journals, and persists across refreshes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Dark Theme Option */}
            <button
              type="button"
              onClick={() => onUpdateTheme('dark')}
              className={`p-3.5 rounded-lg border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#141822] border-emerald-500 ring-1 ring-emerald-500/50 shadow-xs'
                  : 'bg-[#121620] border-[#222a3a] hover:border-[#333f55] opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#1c2333] flex items-center justify-center text-gray-200">
                      <Moon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-sm text-white">Dark</span>
                  </div>
                  {theme === 'dark' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-normal mb-3">
                  Dark terminal obsidian workspace with institutional emerald accents and high-contrast monospace metrics.
                </p>
              </div>

              {/* Visual preview swatch */}
              <div className="h-7 rounded bg-[#0c0e12] border border-[#232b3b] p-1.5 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <div className="h-1.5 w-12 rounded-full bg-[#232b3b]" />
                <div className="h-1.5 w-6 rounded-full bg-[#1b2230]" />
              </div>
            </button>

            {/* Light Theme Option */}
            <button
              type="button"
              onClick={() => onUpdateTheme('light')}
              className={`p-3.5 rounded-lg border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#ffffff] border-pink-500 ring-1 ring-pink-500/50 shadow-xs'
                  : 'bg-[#151a24] border-[#222a3a] hover:border-[#333f55] opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-pink-100 text-pink-600 flex items-center justify-center">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-sm text-white">Light</span>
                  </div>
                  {theme === 'light' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-pink-500/20 text-pink-500 font-bold border border-pink-500/30">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 leading-normal mb-3">
                  Clean, crisp light workspace with high legibility, clean borders, and signature pink accents.
                </p>
              </div>

              {/* Visual preview swatch */}
              <div className="h-7 rounded bg-[#faf5f7] border border-[#f3d2dc] p-1.5 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-pink-500 shrink-0" />
                <div className="h-1.5 w-12 rounded-full bg-[#f3d2dc]" />
                <div className="h-1.5 w-6 rounded-full bg-[#fce7ec]" />
              </div>
            </button>
          </div>
        </div>

        {/* Time Zone Configuration Card */}
        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#1b2230]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Desk Time Zone</h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-mono rounded-xs border border-emerald-500/20 font-semibold">
              {currentOffset}
            </span>
          </div>

          <div className="p-3 bg-[#141822] border border-[#202735] rounded-md space-y-1.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Time Zone:</span>
              <span className="text-white font-bold">{timeZone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current UTC Offset:</span>
              <span className="text-emerald-400 font-bold">{currentOffset}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current Local Desk Time:</span>
              <span className="text-gray-200 tabular-nums">{previewLocalTime}</span>
            </div>
          </div>

          {/* Quick Select Primary Trading Zones */}
          <div>
            <label className="block text-gray-300 mb-1.5 font-medium">
              Primary Trading Centers:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {primaryTradingZones.map((tz) => {
                const isSelected = timeZone === tz;
                const offset = getTimezoneOffsetString(tz);
                return (
                  <button
                    key={tz}
                    type="button"
                    onClick={() => onUpdateTimezone(tz)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow-xs'
                        : 'bg-[#151a24] text-gray-300 hover:text-white hover:bg-[#1d2332] border-[#232b3b]'
                    }`}
                  >
                    <span>{tz.split('/')[1] || tz}</span>
                    <span className="ml-1 opacity-70 text-[10px]">({offset})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Select Full List */}
          <div className="space-y-2 pt-2 border-t border-[#1a202c]">
            <label className="block text-gray-300 font-medium">
              Select or Search Supported IANA Time Zone:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by city, region, or IANA code..."
                value={tzSearchQuery}
                onChange={(e) => setTzSearchQuery(e.target.value)}
                className="w-full bg-[#161c26] border border-[#232b3b] rounded-md pl-8 pr-3 py-1.5 text-white placeholder:text-gray-400 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <select
              value={timeZone}
              onChange={(e) => onUpdateTimezone(e.target.value)}
              className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
            >
              {filteredTimezones.map((tz) => {
                const offset = getTimezoneOffsetString(tz.iana);
                return (
                  <option key={tz.iana} value={tz.iana}>
                    {tz.label} ({offset}) — {tz.iana}
                  </option>
                );
              })}
            </select>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
            Uses native browser IANA conversion (<code className="text-gray-300">Intl.DateTimeFormat</code>).
            Daylight saving time (DST) is automatically tracked. Stored timestamps are kept in universal ISO 8601 format and never distorted when switching view time zones.
          </p>
        </div>

        {/* Workspace Defaults */}
        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1b2230]">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Default Calculator Parameters</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Default Account Balance ($ USD)
              </label>
              <input
                type="number"
                step="100"
                min="10"
                value={accountBalance}
                onChange={(e) => onUpdateBalance(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Used to initialize the Risk Calculator upon opening.
              </span>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-medium">
                Default Risk Ceiling (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={defaultRiskPct}
                onChange={(e) => onUpdateRisk(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161c26] border border-[#232b3b] rounded-md px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-hidden"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Standard discretionary risk allotment (typically 0.5% – 1.0%).
              </span>
            </div>
          </div>
        </div>

        {/* Data Export & Backup */}
        <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1b2230]">
            <Download className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Data Export & Backup Archive</h3>
          </div>

          <p className="text-gray-400 leading-relaxed">
            All records are stored locally in browser storage. Export regular backups to prevent accidental data loss.
          </p>

          <div className="space-y-3">
            {/* CSV Export */}
            <div className="p-3.5 bg-[#141822] border border-[#202735] rounded-md flex items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-white block">Trade Journal CSV</span>
                <span className="text-gray-400 text-[11px]">
                  Export formatted spreadsheet of all {trades.length} recorded trades
                </span>
              </div>
              <button
                onClick={() => exportTradesToCSV(trades, timeZone)}
                disabled={trades.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b2230] hover:bg-[#252f42] text-white rounded-md border border-[#2a354a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* JSON Full Backup */}
            <div className="p-3.5 bg-[#141822] border border-[#202735] rounded-md flex items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-white block">Complete JSON Snapshot</span>
                <span className="text-gray-400 text-[11px]">
                  Backup journal, premarket routines, charting notes, and rules
                </span>
              </div>
              <button
                onClick={exportFullBackupJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b2230] hover:bg-[#252f42] text-white rounded-md border border-[#2a354a] transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Download Backup</span>
              </button>
            </div>

            {/* JSON Restore */}
            <div className="p-3.5 bg-[#141822] border border-[#202735] rounded-md flex items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-white block">Restore from Backup</span>
                <span className="text-gray-400 text-[11px]">
                  Upload a previously exported .json backup file
                </span>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors shrink-0 font-medium"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Device Warning */}
      <div className="bg-[#121620] border border-[#202838] rounded-lg p-5 flex items-start gap-3.5 text-xs text-gray-300">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h4 className="font-semibold text-white text-sm">
            Local Storage Boundary & Data Retention Warning
          </h4>
          <p className="leading-relaxed text-gray-400">
            Edge Trader stores your journal entries, premarket checklists, and custom rules exclusively
            within your browser&apos;s local storage (<code className="text-gray-200">window.localStorage</code>).
            Data is strictly bound to this browser on this device. If you clear website data, cookies, or use an
            incognito/private browsing window, your entries will be removed. Always download periodic JSON backups.
          </p>
        </div>
      </div>

      {/* Privacy and Deployment Safety Guide */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 space-y-4 text-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1b2230]">
          <Lock className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            Privacy Architecture & Production Deployment Guide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div className="space-y-2 bg-[#0c0f16] p-4 rounded-md border border-[#181f2b]">
            <h4 className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Current Privacy Isolation</span>
            </h4>
            <p className="text-gray-400 leading-relaxed">
              In this prototype build, zero trade records, journal notes, or balances are transmitted across
              the network to any remote server, database, or analytics tracker. Your trading strategy remains completely private to this client.
            </p>
          </div>

          <div className="space-y-2 bg-[#0c0f16] p-4 rounded-md border border-[#181f2b]">
            <h4 className="font-semibold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Restricting Access in Public Deployments</span>
            </h4>
            <p className="text-gray-400 leading-relaxed">
              If deploying Edge Trader to a public hosting domain (e.g. Cloud Run, Vercel), do not assume
              the URL is private. To restrict access to yourself:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-400 mt-1">
              <li>Configure real authentication (e.g. Firebase Auth, Google Workspace OAuth, or Cloudflare Access).</li>
              <li>Never use a client-side hardcoded password screen as a substitute for real security.</li>
              <li>Keep local storage decoupled from cloud authentication tokens.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Danger Zone: Clear Data */}
      <div className="bg-[#150f14] border border-rose-950/60 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <h4 className="text-sm font-semibold text-rose-400">Clear All Workspace Data</h4>
          <p className="text-gray-400 mt-0.5">
            Permanently delete all stored journal trades, premarket snapshots, charting notes, and restore default rules.
          </p>
        </div>

        <button
          onClick={onRequestClearAll}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-md transition-colors shrink-0 font-medium"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Clear All Data</span>
        </button>
      </div>
    </div>
  );
};
