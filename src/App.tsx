import { useState, useEffect, useRef } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Gamepad2, Layers } from 'lucide-react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-cyan-900/10 blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vh] bg-magenta-900/10 blur-[120px] translate-y-1/2 -translate-x-1/4" />
      </div>

      <header className="relative z-20 p-8 flex justify-between items-center bg-black/20 backdrop-blur-md border-bottom border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-magenta-500 rounded-xl flex items-center justify-center p-2 shadow-lg">
            <Layers className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Rhythm Snake</h1>
            <p className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.3em] mt-1">Terminal Ver 4.0.2</p>
          </div>
        </div>

        <div className="flex gap-8 items-center font-mono text-xs uppercase tracking-widest hidden md:flex">
          <div className="flex flex-col items-end">
            <span className="text-zinc-500">System Status</span>
            <span className="text-lime-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
              Operational
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-zinc-500">Current Session</span>
            <span className="text-white">Active Grid</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 p-8 max-w-7xl mx-auto w-full">
        {/* Game Controller Section */}
        <section className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-3">
              <Gamepad2 className="text-cyan-400" size={20} />
              <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-zinc-400">Snake Matrix</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 uppercase font-mono mb-1 tracking-widest">Score</div>
                <motion.div 
                  key={score}
                  initial={{ scale: 1.2, color: '#00ffff' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-2xl font-black italic tracking-tight"
                >
                  {score.toString().padStart(6, '0')}
                </motion.div>
              </div>
            </div>
          </div>

          <SnakeGame 
            onScoreUpdate={setScore} 
            isPlaying={isPlaying} 
          />

          <div className="flex gap-4 font-mono text-[10px] text-zinc-600 uppercase tracking-widest bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5">
            <span className="flex items-center gap-2"><span className="w-1 h-1 bg-zinc-600 rounded-full" /> Arrows to Move</span>
            <span className="flex items-center gap-2"><span className="w-1 h-1 bg-zinc-600 rounded-full" /> Music syncs play</span>
          </div>
        </section>

        {/* Music Player Section */}
        <section className="flex flex-col gap-8 w-full max-w-md">
          <div className="flex items-center gap-3 px-2">
            <Music className="text-magenta-400" size={20} />
            <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-zinc-400">Audio Deck</h2>
          </div>
          
          <MusicPlayer 
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={nextTrack}
            onPrev={prevTrack}
            progress={progress}
          />

          {/* Track List Mini */}
          <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/5 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              Up Next
            </div>
            <div className="divide-y divide-white/5">
              {TRACKS.map((track, idx) => (
                <button 
                  key={track.id}
                  onClick={() => setCurrentTrackIndex(idx)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group ${currentTrackIndex === idx ? 'bg-cyan-500/5' : ''}`}
                >
                  <span className={`font-mono text-xs ${currentTrackIndex === idx ? 'text-cyan-400' : 'text-zinc-600'}`}>0{idx + 1}</span>
                  <div className="text-left flex-1">
                    <div className={`text-xs font-bold uppercase ${currentTrackIndex === idx ? 'text-cyan-400' : 'text-white'}`}>{track.title}</div>
                    <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{track.artist}</div>
                  </div>
                  {currentTrackIndex === idx && isPlaying && (
                     <div className="flex gap-0.5 h-3 items-end">
                       {[1, 2, 3].map(i => (
                         <motion.div key={i} animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }} className="w-1 bg-cyan-400 rounded-full" />
                       ))}
                     </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.25em]">
          <div>A High-Poly Digital Experience</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-magenta-400 transition-colors">Privacy Shield</a>
            <span>© 2026 SynthCore Industries</span>
          </div>
        </div>
      </footer>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src={currentTrack.url}
      />
    </div>
  );
}
