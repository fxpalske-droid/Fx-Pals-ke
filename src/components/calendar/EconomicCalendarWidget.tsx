import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { ThemeMode } from '../../types';

interface EconomicCalendarWidgetProps {
  height?: number | string;
  theme?: ThemeMode;
}

export const EconomicCalendarWidget: React.FC<EconomicCalendarWidgetProps> = ({
  height = '600px',
  theme = 'dark',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setLoadError(false);
    const container = containerRef.current;
    if (!container) return;

    // Clear previous children
    container.innerHTML = '';

    const widgetHolder = document.createElement('div');
    widgetHolder.className = 'tradingview-widget-container__widget';
    widgetHolder.style.height = typeof height === 'number' ? `${height}px` : height;
    widgetHolder.style.width = '100%';
    container.appendChild(widgetHolder);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '100%',
      colorTheme: theme === 'light' ? 'light' : 'dark',
      isTransparent: true,
      locale: 'en',
      importanceFilter: '-1,0,1',
      countryFilter: 'us,eu,gb,jp,ca,au,ch',
    });

    script.onerror = () => {
      setLoadError(true);
    };

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [key, height, theme]);

  return (
    <div className="bg-[#0e121a] border border-[#1b2230] rounded-lg overflow-hidden flex flex-col">
      {/* Widget Header */}
      <div className="px-4 py-2.5 bg-[#121622] border-b border-[#1b2230] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-gray-200 font-semibold">
            TradingView Live Economic Calendar Feed
          </span>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono">
            LIVE EMBED
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            title="Reload widget"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <a
            href="https://www.tradingview.com/economic-calendar/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 ml-2"
          >
            <span>Open on TradingView</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Widget Embed Area */}
      <div
        className="relative w-full bg-[#0b0d13]"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        <div ref={containerRef} className="tradingview-widget-container h-full w-full [&_iframe]:bg-[#ffffff]" />

        {loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#0c0e14] text-center">
            <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
            <h4 className="text-sm font-semibold text-white mb-1">
              Live Embed Unavailable or Blocked
            </h4>
            <p className="text-xs text-gray-400 max-w-md mb-4">
              TradingView embed scripts may be restricted by ad-blockers or strict network privacy filters.
              You can access live events directly or view our structured macro schedule below.
            </p>
            <a
              href="https://www.tradingview.com/economic-calendar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
            >
              <span>Launch TradingView Calendar</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Footer attribution */}
      <div className="px-4 py-2 bg-[#0c0f16] border-t border-[#181d28] flex items-center justify-between text-[11px] text-gray-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <span>Real-time macro stream powered by Trading Economics via TradingView.</span>
        </div>
        <span>Timezone synced with TradingView chart engine</span>
      </div>
    </div>
  );
};
