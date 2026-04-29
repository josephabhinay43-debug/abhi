import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Track } from '../types';
import { motion } from 'motion/react';

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  progress: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  progress
}) => {
  return (
    <div className="flex flex-col gap-6 p-8 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-magenta-500/20 blur-[100px] pointer-events-none" />

      {/* Track Info */}
      <div className="flex gap-6 items-center z-10">
        <motion.div 
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative shrink-0"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className="w-24 h-24 rounded-2xl object-cover shadow-lg border border-white/10"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [10, 20, 10] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                  className="w-1 bg-cyan-400 rounded-full"
                />
              ))}
            </div>
          )}
        </motion.div>
        
        <div className="flex flex-col min-w-0">
          <h3 className="text-xl font-bold text-white truncate leading-tight uppercase tracking-tight">
            {currentTrack.title}
          </h3>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mt-1 italic">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3 z-10">
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-400 to-magenta-500"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
          <span>{Math.floor((progress * currentTrack.duration) / 6000)}:{(Math.floor((progress * currentTrack.duration) / 100) % 60).toString().padStart(2, '0')}</span>
          <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between z-10 px-4">
        <button 
          onClick={onPrev}
          className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <SkipBack size={24} fill="currentColor" className="opacity-80" />
        </button>
        
        <button 
          onClick={onPlayPause}
          className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={onNext}
          className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <SkipForward size={24} fill="currentColor" className="opacity-80" />
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 z-10 opacity-30 hover:opacity-100 transition-opacity">
        <Volume2 size={14} className="text-zinc-500" />
        <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-zinc-500" />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
