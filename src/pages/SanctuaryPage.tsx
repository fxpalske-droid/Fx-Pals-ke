import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Clock,
  Image as ImageIcon,
  Music,
  CheckCircle2,
  Upload,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { soundscapeEngine, SoundscapeType } from '../utils/soundscapes';
import { NavPage } from '../components/layout/Sidebar';

interface BackgroundOption {
  id: string;
  name: string;
  url: string;
  category: string;
}

const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'ocean',
    name: 'Peaceful Ocean',
    category: 'Ocean',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'forest',
    name: 'Quiet Forest',
    category: 'Forest',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'mountains',
    name: 'Mountains at Sunrise',
    category: 'Mountains',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    category: 'Rain',
    url: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'night',
    name: 'Starry Night',
    category: 'Night',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'minimal',
    name: 'Minimalist Dark',
    category: 'Abstract',
    url: '', // Handled as gradient
  },
];

interface MusicOption {
  id: SoundscapeType;
  name: string;
  description: string;
}

const MUSIC_OPTIONS: MusicOption[] = [
  { id: 'bowl', name: 'Ambient Meditation (432 Hz)', description: 'Singing bowl resonance & warm calm harmonics' },
  { id: 'ocean', name: 'Ocean Waves', description: 'Gentle rhythmic surf and rolling water' },
  { id: 'rain', name: 'Gentle Rain', description: 'Soft soothing raindrops' },
  { id: 'forest', name: 'Quiet Forest', description: 'Peaceful woodland breeze and nature rustle' },
  { id: 'brown', name: 'Deep Calm (Brown Noise)', description: 'Low warm frequency for clearing mental chatter' },
  { id: 'silence', name: 'Silence', description: 'Timer countdown without ambient audio' },
];

const DURATION_PRESETS = [3, 5, 10, 15, 20, 30]; // in minutes

interface SanctuarySettings {
  durationMinutes: number;
  bgId: string;
  customBgUrl: string;
  overlayOpacity: number;
  musicId: SoundscapeType;
  volume: number;
}

const SETTINGS_STORAGE_KEY = 'edge_trader_sanctuary_settings_v1';

import { SanctuarySession } from '../types';

interface SanctuaryPageProps {
  timeZone?: string;
  onCompleteMeditation?: () => void;
  onNavigate?: (page: NavPage) => void;
  // Keep legacy props optional for compatibility
  sessions?: SanctuarySession[];
  onSaveSession?: (session: SanctuarySession) => void;
  onClearSessions?: () => void;
  onDeleteSession?: (sessionId: string) => void;
}

export const SanctuaryPage: React.FC<SanctuaryPageProps> = ({
  onCompleteMeditation,
  onNavigate,
}) => {
  // Load initial settings
  const [settings, setSettings] = useState<SanctuarySettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return {
      durationMinutes: 10,
      bgId: 'ocean',
      customBgUrl: '',
      overlayOpacity: 0.65,
      musicId: 'bowl',
      volume: 0.5,
    };
  });

  // Timer states
  const [secondsRemaining, setSecondsRemaining] = useState<number>(settings.durationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [completedNotice, setCompletedNotice] = useState<boolean>(false);

  // Custom audio element ref if user uploads their own audio
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioName, setCustomAudioName] = useState<string>('');

  const timerRef = useRef<number | null>(null);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Adjust volume in audio engine
  useEffect(() => {
    soundscapeEngine.setVolume(settings.volume);
    if (customAudioRef.current) {
      customAudioRef.current.volume = settings.volume;
    }
  }, [settings.volume]);

  // Handle timer countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Cleanup on unmount (stop music when navigating away)
  useEffect(() => {
    return () => {
      soundscapeEngine.stop();
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
    };
  }, []);

  const handleSessionEnd = () => {
    setIsRunning(false);
    setIsCompleted(true);
    soundscapeEngine.stop();
    if (customAudioRef.current) {
      customAudioRef.current.pause();
    }
    // Play gentle completion chime
    soundscapeEngine.playChime(432);
  };

  // Play, Pause, Stop Controls
  const handlePlay = () => {
    if (secondsRemaining <= 0) {
      setSecondsRemaining(settings.durationMinutes * 60);
      setIsCompleted(false);
    }
    setIsRunning(true);

    if (customAudioUrl && customAudioRef.current) {
      customAudioRef.current.play().catch(() => {});
    } else {
      soundscapeEngine.startSoundscape(settings.musicId);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    if (customAudioUrl && customAudioRef.current) {
      customAudioRef.current.pause();
    } else {
      soundscapeEngine.pause();
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setSecondsRemaining(settings.durationMinutes * 60);
    soundscapeEngine.stop();
    if (customAudioRef.current) {
      customAudioRef.current.pause();
      customAudioRef.current.currentTime = 0;
    }
  };

  const handleSelectDuration = (minutes: number) => {
    setSettings((prev) => ({ ...prev, durationMinutes: minutes }));
    if (!isRunning) {
      setSecondsRemaining(minutes * 60);
      setIsCompleted(false);
    }
  };

  const handleCustomDurationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMinutesInput, 10);
    if (!isNaN(val) && val > 0 && val <= 120) {
      handleSelectDuration(val);
      setCustomMinutesInput('');
    }
  };

  const handleSelectBackground = (id: string) => {
    setSettings((prev) => ({ ...prev, bgId: id, customBgUrl: '' }));
  };

  const handleUploadBackground = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSettings((prev) => ({
            ...prev,
            bgId: 'custom',
            customBgUrl: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setCustomAudioName(file.name);
      if (customAudioRef.current) {
        customAudioRef.current.src = url;
        customAudioRef.current.volume = settings.volume;
      }
    }
  };

  const handleSelectMusic = (id: SoundscapeType) => {
    setSettings((prev) => ({ ...prev, musicId: id }));
    setCustomAudioUrl(null);
    setCustomAudioName('');
    if (isRunning) {
      if (customAudioRef.current) {
        customAudioRef.current.pause();
      }
      soundscapeEngine.startSoundscape(id);
    }
  };

  const handleMarkCompletePremarket = () => {
    if (onCompleteMeditation) {
      onCompleteMeditation();
      setCompletedNotice(true);
      setTimeout(() => setCompletedNotice(false), 3000);
    }
  };

  // Formatting MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeString = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const totalDurationSecs = settings.durationMinutes * 60;
  const progressPct =
    totalDurationSecs > 0
      ? Math.min(100, Math.round(((totalDurationSecs - secondsRemaining) / totalDurationSecs) * 100))
      : 0;

  // Active Background
  const currentBgObj = BACKGROUND_OPTIONS.find((b) => b.id === settings.bgId);
  const activeBgUrl = settings.bgId === 'custom' ? settings.customBgUrl : currentBgObj?.url;

  return (
    <div className="relative min-h-[620px] rounded-xl overflow-hidden border border-[#1e2533] shadow-2xl transition-all">
      {/* Background Image / Texture Layer */}
      {activeBgUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
          style={{ backgroundImage: `url(${activeBgUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-radial from-[#131b26] via-[#0d1117] to-[#07090d]" />
      )}

      {/* Customizable Dark Tint / Opacity Layer */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: settings.overlayOpacity }}
      />

      {/* Hidden Audio Element for custom user-uploaded audio */}
      <audio ref={customAudioRef} loop />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between min-h-[620px] p-5 sm:p-8 bg-[#ffffff]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                The Sanctuary
                <span className="text-[11px] font-normal font-mono text-emerald-400/80 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40">
                  Mindset &amp; Meditation
                </span>
              </h2>
              <p className="text-xs text-gray-400 hidden sm:block">
                Regulate your state, release market FOMO, and foster calm discipline.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#ffffff] hover:bg-black/60 border border-white/10 rounded-md backdrop-blur-xs transition-colors"
              title={isZenMode ? 'Show Controls' : 'Zen Focus Mode (hide panels)'}
            >
              {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline bg-[#ffffff]">{isZenMode ? 'Show Controls' : 'Zen View'}</span>
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('premarket')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/60 rounded-md backdrop-blur-xs transition-colors"
              >
                <span>Back to Premarket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Center: Main Meditation Timer Display */}
        <div className="flex flex-col items-center justify-center my-8 text-center">
          {/* Circular Visual Ring Container */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-white/10 fill-none"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-emerald-400 fill-none transition-all duration-1000 ease-linear"
                strokeWidth="4"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPct) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Center Display */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest drop-shadow-md">
                {timeString}
              </span>

              <span className="mt-1 text-xs font-mono tracking-wider uppercase text-emerald-400/90 font-medium">
                {isCompleted
                  ? 'Session Complete'
                  : isRunning
                  ? 'Meditating'
                  : secondsRemaining < totalDurationSecs
                  ? 'Paused'
                  : 'Ready'}
              </span>

              {settings.musicId !== 'silence' && isRunning && (
                <span className="text-[11px] text-gray-300 mt-1 flex items-center gap-1 font-mono opacity-80">
                  <Music className="w-3 h-3 text-emerald-400 animate-pulse" />
                  {customAudioName ? customAudioName.slice(0, 16) : currentBgObj?.name}
                </span>
              )}
            </div>
          </div>

          {/* Basic Play / Pause / Stop Controls */}
          <div className="flex items-center gap-3 mt-6">
            {!isRunning ? (
              <button
                type="button"
                onClick={handlePlay}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-full shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{secondsRemaining < totalDurationSecs && !isCompleted ? 'Resume' : 'Play'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-full shadow-lg shadow-amber-950/40 transition-transform active:scale-95"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStop}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white font-medium text-xs rounded-full border border-white/10 backdrop-blur-xs transition-colors"
              title="Stop & Reset Timer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          </div>

          {/* Mark Premarket Meditation Complete Action */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleMarkCompletePremarket}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/70 rounded-full transition-colors backdrop-blur-xs shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mark Premarket Meditation Complete</span>
            </button>

            {completedNotice && (
              <span className="text-[11px] text-emerald-400 font-mono animate-fade-in">
                ✓ Checked off in Premarket Routine!
              </span>
            )}
          </div>
        </div>

        {/* Bottom Customization Controls (Hidden in Zen Mode) */}
        {!isZenMode && (
          <div className="bg-[#ffffff] border border-white/10 rounded-xl p-4 sm:p-5 backdrop-blur-md space-y-4">
            {/* 1. Duration Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Meditation Duration
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {settings.durationMinutes} minutes
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {DURATION_PRESETS.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => handleSelectDuration(dur)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-md border transition-all ${
                      settings.durationMinutes === dur
                        ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-xs'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}

                {/* Custom Duration Input */}
                <form onSubmit={handleCustomDurationSubmit} className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Custom"
                    value={customMinutesInput}
                    onChange={(e) => setCustomMinutesInput(e.target.value)}
                    className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-white placeholder-gray-500 focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 text-xs font-mono bg-white/10 hover:bg-white/20 text-gray-200 rounded border border-white/10"
                  >
                    Set
                  </button>
                </form>
              </div>
            </div>

            {/* 2. Background Picture Selection */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                  Background Picture
                </span>

                {/* Brightness / Tint Slider */}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <span>Tint:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="0.85"
                    step="0.05"
                    value={settings.overlayOpacity}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        overlayOpacity: parseFloat(e.target.value),
                      }))
                    }
                    className="w-20 accent-emerald-500 h-1.5 bg-white/20 rounded cursor-pointer"
                    title="Adjust overlay brightness"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {BACKGROUND_OPTIONS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => handleSelectBackground(bg.id)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                      settings.bgId === bg.id
                        ? 'bg-blue-600/80 border-blue-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {bg.name}
                  </button>
                ))}

                {/* Upload Personal Photo */}
                <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Upload Picture</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadBackground}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 3. Music & Ambience Selection */}
            <div className="pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-300 font-semibold flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-emerald-400" />
                  Meditation Music &amp; Audio
                </span>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  {settings.volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.volume}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        volume: parseFloat(e.target.value),
                      }))
                    }
                    className="w-24 accent-emerald-500 h-1.5 bg-white/20 rounded cursor-pointer"
                    title="Volume slider"
                  />
                  <span className="w-7 text-right">{Math.round(settings.volume * 100)}%</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {MUSIC_OPTIONS.map((mus) => (
                  <button
                    key={mus.id}
                    type="button"
                    onClick={() => handleSelectMusic(mus.id)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                      settings.musicId === mus.id && !customAudioUrl
                        ? 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-xs'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                    title={mus.description}
                  >
                    {mus.name}
                  </button>
                ))}

                {/* Upload Personal Audio */}
                <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{customAudioName ? customAudioName.slice(0, 14) + '...' : 'Upload Audio (MP3/WAV)'}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleUploadAudio}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
