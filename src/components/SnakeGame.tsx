import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, CANVAS_SIZE, INITIAL_SNAKE } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  isPlaying: boolean;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const moveBuffer = useRef<Direction>('UP');

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('UP');
    moveBuffer.current = 'UP';
    setScore(0);
    setIsGameOver(false);
    onScoreUpdate(0);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') moveBuffer.current = 'UP'; break;
        case 'ArrowDown': if (direction !== 'UP') moveBuffer.current = 'DOWN'; break;
        case 'ArrowLeft': if (direction !== 'RIGHT') moveBuffer.current = 'LEFT'; break;
        case 'ArrowRight': if (direction !== 'LEFT') moveBuffer.current = 'RIGHT'; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback(() => {
    if (isGameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const newHead = { ...prevSnake[0] };
      const currentDir = moveBuffer.current;
      setDirection(currentDir);

      if (currentDir === 'UP') newHead.y -= 1;
      if (currentDir === 'DOWN') newHead.y += 1;
      if (currentDir === 'LEFT') newHead.x -= 1;
      if (currentDir === 'RIGHT') newHead.x += 1;

      // Wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= CANVAS_SIZE / GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= CANVAS_SIZE / GRID_SIZE ||
        prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const nextScore = score + 10;
        setScore(nextScore);
        onScoreUpdate(nextScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [isGameOver, food, score, onScoreUpdate, generateFood, isPlaying]);

  useEffect(() => {
    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;

      if (deltaTime > 100) { // Speed controlled here
        update();
        lastTimeRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    snake.forEach((p, index) => {
      ctx.shadowBlur = index === 0 ? 20 : 10;
      ctx.shadowColor = '#00ffff';
      ctx.fillStyle = index === 0 ? '#00ffff' : '#008888';
      
      const padding = 2;
      ctx.fillRect(
        p.x * GRID_SIZE + padding,
        p.y * GRID_SIZE + padding,
        GRID_SIZE - padding * 2,
        GRID_SIZE - padding * 2
      );
    });

    // Reset shadow for further drawing
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
      <canvas 
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="relative bg-black rounded-lg border border-white/10 shadow-2xl"
      />
      
      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg"
          >
            <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter">GAME OVER</h2>
            <p className="text-cyan-400 font-mono mb-8 uppercase tracking-widest">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors rounded-none"
            >
              Restart Terminal
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SnakeGame;
