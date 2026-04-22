"use client";

import { useEffect, useRef, useState } from 'react';
import { GameEngine, GameState, GameTheme } from '../game/GameEngine';

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.mainMenu);
  const [score, setScore] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<GameTheme>(GameTheme.classic);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 400, height: 600 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Fixed vertical resolution viewport strategy (like Flame's FixedVerticalResolution)
    // The height is ALWAYS 600 logical pixels.
    // The width expands or shrinks to match the physical window aspect ratio.
    const updateSize = () => {
      const targetHeight = 600;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      const aspect = screenWidth / screenHeight;
      const targetWidth = targetHeight * aspect;
      
      setCanvasDimensions({ width: targetWidth, height: targetHeight });
      
      if (canvasRef.current) {
        canvasRef.current.width = targetWidth;
        canvasRef.current.height = targetHeight;
      }
      return { targetWidth, targetHeight };
    };

    const { targetWidth, targetHeight } = updateSize();
    const gameEngine = new GameEngine(canvasRef.current, targetWidth, targetHeight);
    
    gameEngine.onStateChange = (state) => setGameState(state);
    gameEngine.onScoreChange = (s) => setScore(s);
    
    gameEngine.start();
    setEngine(gameEngine);
    
    const handleResize = () => {
      const { targetWidth, targetHeight } = updateSize();
      gameEngine.width = targetWidth;
      gameEngine.height = targetHeight;
      gameEngine.ground.onGameResize(targetWidth, targetHeight);
      gameEngine.bird.onGameResize(targetWidth, targetHeight);
    };

    window.addEventListener('resize', handleResize);
    
      return () => {
        window.removeEventListener('resize', handleResize);
        gameEngine.stop();
      };
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.toString() + "\n" + (e.stack || ""));
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault(); // prevent scrolling
    engine?.onTap();
  };

  const isSelected = (theme: GameTheme) => currentTheme === theme;

  const handleThemeChange = (theme: GameTheme) => {
    setCurrentTheme(theme);
    engine?.setTheme(theme);
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden touch-none"
      style={{ fontFamily: '"Courier New", Courier, monospace' }}
      onPointerDown={handlePointerDown}
    >
      <canvas 
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        className="block w-full h-full"
      />
      
      {errorMsg && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white p-4 whitespace-pre-wrap overflow-auto pointer-events-auto z-50 text-xs">
          <strong>GAME ENGINE CRASHED:</strong><br />{errorMsg}
        </div>
      )}
      
      {/* OVERLAYS */}
      
      {gameState === GameState.mainMenu && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center">
            <h1 className="text-5xl font-bold text-white tracking-widest text-center" 
                style={{ textShadow: '4px 4px 0px #000' }}>
              FLAPPY<br/>CLONE
            </h1>
            
            <div className="mt-8 mb-4">
              <h2 className="text-xl text-white font-bold text-center mb-2" style={{ textShadow: '2px 2px 0px #000' }}>
                MAP THEME
              </h2>
              <div className="flex gap-2">
                {[
                  { name: 'CLASSIC', theme: GameTheme.classic },
                  { name: 'NIGHT', theme: GameTheme.night },
                  { name: 'DESERT', theme: GameTheme.desert },
                ].map((t) => (
                  <button
                    key={t.name}
                    onPointerDown={(e) => { e.stopPropagation(); handleThemeChange(t.theme); }}
                    className={`px-3 py-1 rounded-full border-2 border-white font-bold text-sm transition-colors ${
                      isSelected(t.theme) ? 'bg-white text-black' : 'bg-transparent text-white'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button 
                onPointerDown={(e) => { e.stopPropagation(); engine?.startWithDifficulty(180, 1.8); }}
                className="w-48 py-3 bg-[#73BF2E] border-4 border-white rounded-xl text-white text-2xl font-bold shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
              >
                EASY
              </button>
              <button 
                onPointerDown={(e) => { e.stopPropagation(); engine?.startWithDifficulty(250, 1.5); }}
                className="w-48 py-3 bg-[#E86101] border-4 border-white rounded-xl text-white text-2xl font-bold shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
              >
                NORMAL
              </button>
              <button 
                onPointerDown={(e) => { e.stopPropagation(); engine?.startWithDifficulty(350, 1.1); }}
                className="w-48 py-3 bg-[#D32F2F] border-4 border-white rounded-xl text-white text-2xl font-bold shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
              >
                HARD
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === GameState.playing && (
        <div className="absolute top-20 left-0 w-full flex justify-center pointer-events-none">
          <h2 className="text-6xl font-bold text-white tracking-widest"
              style={{ textShadow: '4px 4px 0px #000' }}>
            {score}
          </h2>
        </div>
      )}

      {gameState === GameState.gameOver && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="bg-[#DED895] border-[6px] border-[#53311E] rounded-2xl p-6 flex flex-col items-center pointer-events-auto shadow-2xl">
            <h2 className="text-4xl font-bold text-[#E86101]" style={{ textShadow: '2px 2px 0px #fff' }}>
              GAME OVER
            </h2>
            <p className="mt-4 text-2xl font-bold text-[#53311E]">
              SCORE: {score}
            </p>
            
            <div className="flex gap-4 mt-8">
              <button 
                onPointerDown={(e) => { e.stopPropagation(); engine?.startGame(); }}
                className="px-5 py-2 bg-[#73BF2E] border-[4px] border-white rounded-xl text-white text-lg font-bold shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
              >
                RESTART
              </button>
              <button 
                onPointerDown={(e) => { e.stopPropagation(); engine?.goToMainMenu(); }}
                className="px-5 py-2 bg-[#E86101] border-[4px] border-white rounded-xl text-white text-lg font-bold shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
              >
                MENU
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
