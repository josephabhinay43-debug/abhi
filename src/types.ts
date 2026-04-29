export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl: string;
}

export type Point = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  status: 'IDLE' | 'PLAYING' | 'PAUSED';
}
