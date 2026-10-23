import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, RefreshCw, AlertCircle, Info, Maximize2 } from 'lucide-react';
import { INSTRUMENT_SPECS, DEFAULT_INSTRUMENT_LIST } from '../utils/instruments';
import { ThemeMode } from '../types';

interface LiveChartsPageProps {
  theme?: ThemeMode;
}

export const LiveChartsPage: React.FC<LiveChartsPageProps> = ({ theme = 'dark' }) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('XAUUSD');
  const [loadError, setLoadError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSpec = INSTRUMENT_SPECS[selectedSymbol] || INSTRUMENT_SPECS['XAUUSD'];
  const tvSymbol = activeSpec.tradingViewSymbol;

  useEffect(() => {
    setLoadError(false);
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    // Create the container element for TradingView widget script
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetInner = document.createElement('div');
    widgetInner.id = `tradingview_${Math.random().toString(36).substring(7)}`;
    widgetInner.style.height = 'calc(100% - 32px)';
    widgetInner.style.width = '100%';

    widgetContainer.appendChild(widgetInner);
    containerRef.current.appendChild(widgetContainer);

    // Inject TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;

    let timeoutId: number;

    script.onload = () => {
      // @ts-expect-error TradingView is injected globally
      if (typeof window.TradingView !== 'undefined') {
        try {
          // @ts-expect-error TradingView global constructor
          new window.TradingView.widget({
            autosize: true,
            symbol: tvSymbol,
            interval: '15',
            timezone: 'Etc/UTC',
            theme: theme === 'light' ? 'light' : 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: theme === 'light' ? '#ffffff' : '#11151c',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: widgetInner.id,
            hide_side_toolbar: false,
            studies: ['MASimple@tv-basicstudies', 'RSI@tv-basicstudies'],
            backgroundColor: theme === 'light' ? '#ffffff' : '#0c0e12',
            gridColor: theme === 'light' ? '#f3d2dc' : '#1a1f2c',
          });
        } catch (e) {
          console.error('TradingView widget initialization error:', e);
          setLoadError(true);
        }
      } else {
        setLoadError(true);
      }
    };

    script.onerror = () => {
      setLoadError(true);
    };

    // Failsafe timeout if script doesn't initialize within 12 seconds
    timeoutId = window.setTimeout(() => {
      // @ts-expect-error TradingView global check
      if (typeof window.TradingView === 'undefined') {
        setLoadError(true);
      }
    }, 12000);

    document.head.appendChild(script);

    return () => {
      window.clearTimeout(timeoutId);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [tvSymbol, theme]);

  const directTvUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSymbol)}`;

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-6rem)]">
      {/* Top Controls Bar */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Symbol Selectors */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase text-gray-400 mr-1 hidden sm:inline">
            Active Pair:
          </span>
          {DEFAULT_INSTRUMENT_LIST.map((sym, index) => {
            const isSelected = selectedSymbol === sym;
            const unselectedBg =
              index === 2 || index === 3 ? 'bg-[#fefeff]' : 'bg-[#ffffff]';
            return (
              <button
                key={sym}
                onClick={() => setSelectedSymbol(sym)}
                className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : `${unselectedBg} text-gray-300 hover:text-white hover:bg-[#1f2636] border border-[#232b3b]`
                }`}
              >
                {sym}
              </button>
            );
          })}
        </div>

        {/* External Link & Info */}
        <div className="flex items-center gap-2">
          <a
            href={directTvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#ddd0e9] hover:bg-[#202735] border border-[#252e3e] rounded-md transition-colors"
          >
            <span>Open on TradingView</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </a>
        </div>
      </div>

      {/* Chart Container Viewport */}
      <div className="flex-1 bg-[#ffffff] border border-[#1e2533] rounded-lg overflow-hidden relative min-h-[460px]">
        {loadError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0d1017]">
            <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">
              TradingView Widget Could Not Load
            </h3>
            <p className="text-xs text-gray-400 max-w-md mb-5 leading-relaxed">
              Third-party script loading was restricted or blocked by your browser network or privacy shields.
              You can open the real live interactive chart for {selectedSymbol} directly on TradingView.
            </p>
            <a
              href={directTvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-xs"
            >
              <span>Launch {selectedSymbol} Chart in New Tab</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-full bg-[#ffffff]" />
        )}
      </div>

      {/* Required Disclaimer note */}
      <div className="bg-[#f9f9f9] border border-[#1b222f] rounded-lg px-4 py-2.5 flex items-start gap-2.5 shrink-0 text-xs text-gray-400">
        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-gray-300 font-medium">Market Data & Timezone Distinction:</strong> Displayed
          candlestick data and exchange delays depend directly on TradingView and its contributing liquidity providers ({activeSpec.tradingViewSymbol}).
          The TradingView chart widget maintains its own internal timezone control directly on the bottom-right time axis of the chart canvas,
          independent of Edge Trader&apos;s app-wide desk timezone setting.
        </p>
      </div>
    </div>
  );
};
