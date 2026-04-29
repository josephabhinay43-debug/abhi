import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Voyager',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Synth Pulse',
    artist: 'Cyber Soul',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Retro Flow',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 315,
    coverUrl: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=300&h=300&auto=format&fit=crop'
  }
];

export const GRID_SIZE = 20;
export const CANVAS_SIZE = 400;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
