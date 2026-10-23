import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Waves, Sparkles, CloudRain, Music2 } from 'lucide-react';
import { soundscapeEngine } from '../../utils/soundscapes';

type SoundscapeType = 'brown' | 'rain' | 'bowl' | 'alpha';

export const SoundscapePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSound, setCurrentSound] = useState<SoundscapeType>('brown');
  const [volume, setVolume] = useState<number>(0.4);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      soundscapeEngine.stop();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundscapeEngine.stop();
      setIsPlaying(false);
    } else {
      soundscapeEngine.setVolume(isMuted ? 0 : volume);
      soundscapeEngine.startSoundscape(currentSound);
      setIsPlaying(true);
    }
  };

  const handleSelectSound = (type: SoundscapeType) => {
    setCurrentSound(type);
    if (isPlaying) {
      soundscapeEngine.startSoundscape(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (!isMuted) {
      soundscapeEngine.setVolume(newVol);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      soundscapeEngine.setVolume(volume);
    } else {
      setIsMuted(true);
      soundscapeEngine.setVolume(0);
    }
  };

  const sounds: { id: SoundscapeType; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'brown',
      title: 'Deep Brown Noise',
      subtitle: 'Soothes racing thoughts & trading anxiety',
      icon: Waves,
    },
    {
      id: 'rain',
      title: 'Gentle Rain & Drift',
      subtitle: 'Organic pink noise for calm focus',
      icon: CloudRain,
    },
    {
      id: 'bowl',
      title: '432 Hz Singing Bowl',
      subtitle: 'Harmonic resonance for emotional grounding',
      icon: Sparkles,
    },
    {
      id: 'alpha',
      title: '10 Hz Alpha Beats',
      subtitle: 'Binaural flow state & precision alertness',
      icon: Music2,
    },
  ];

  return (
    <div className="bg-[#0e121a] border border-[#1b2230] rounded-xl p-5 sm:p-6 space-y-5">
      {/* Soundscape Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#181d28]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-0.5">
            ACOUSTIC GROUNDING
          </span>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <span>Ambient Mental Soundscapes</span>
            {isPlaying && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                PLAYING
              </span>
            )}
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">
            Synthesized locally in your browser with zero network lag or tracking.
          </p>
        </div>

        {/* Master Play & Volume Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Stop Soundscape' : 'Play Soundscape'}</span>
          </button>

          {/* Volume Slider & Mute */}
          <div className="flex items-center gap-2 bg-[#121622] px-3 py-1.5 rounded-lg border border-[#1e2536]">
            <button
              onClick={handleToggleMute}
              className="text-gray-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 accent-emerald-500 cursor-pointer h-1.5 bg-[#252f42] rounded-lg"
              title="Soundscape Volume"
            />
            <span className="text-[10px] font-mono text-gray-400 w-7 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Sound Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sounds.map((sound) => {
          const Icon = sound.icon;
          const isCurrent = currentSound === sound.id;
          return (
            <button
              key={sound.id}
              onClick={() => handleSelectSound(sound.id)}
              className={`text-left p-3.5 rounded-lg border transition-all ${
                isCurrent
                  ? 'bg-[#15231c] border-emerald-500/60 shadow-md shadow-emerald-950/40'
                  : 'bg-[#121622] border-[#1e2536] hover:bg-[#161c2b] hover:border-[#2a3449]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center ${
                    isCurrent ? 'bg-emerald-600 text-white' : 'bg-[#1a2130] text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isCurrent && isPlaying && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>
              <div className="font-semibold text-xs text-white mb-0.5">{sound.title}</div>
              <div className="text-[11px] text-gray-400 leading-snug">{sound.subtitle}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
