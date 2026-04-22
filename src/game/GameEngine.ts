export enum GameState {
  mainMenu,
  playing,
  gameOver,
}

export enum GameTheme {
  classic,
  night,
  desert,
}

export interface ThemeColors {
  sky: string;
  pipe: string;
  pipeStroke: string;
  grass: string;
  dirt: string;
}

export const themes: Record<GameTheme, ThemeColors> = {
  [GameTheme.classic]: { sky: '#70C5CE', pipe: '#73BF2E', pipeStroke: '#53311E', grass: '#73BF2E', dirt: '#DED895' },
  [GameTheme.night]: { sky: '#0A192F', pipe: '#E040FB', pipeStroke: '#4A148C', grass: '#1A237E', dirt: '#37474F' },
  [GameTheme.desert]: { sky: '#FCE4EC', pipe: '#FFB300', pipeStroke: '#FF6F00', grass: '#FFCC80', dirt: '#D7CCC8' },
};

import { Bird } from './components/Bird';
import { Ground } from './components/Ground';
import { PipeManager } from './components/PipeManager';
import { SoundManager } from './SoundManager';

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  
  width: number;
  height: number;
  
  gameState: GameState = GameState.mainMenu;
  score: number = 0;
  onScoreChange?: (score: number) => void;
  onStateChange?: (state: GameState) => void;
  
  gameSpeed: number = 250.0;
  pipeSpawnInterval: number = 1.5;
  
  currentTheme: GameTheme = GameTheme.classic;
  themeColors: ThemeColors = themes[GameTheme.classic];
  
  bird: Bird;
  ground: Ground;
  pipeManager: PipeManager;
  soundManager: SoundManager;
  
  lastTime: number = 0;
  animationFrameId: number = 0;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = width;
    this.height = height;
    
    this.bird = new Bird(this);
    this.ground = new Ground(this);
    this.pipeManager = new PipeManager(this);
    this.soundManager = new SoundManager();
    
    // Initial size configuration
    this.ground.onGameResize(width, height);
    this.bird.onGameResize(width, height);
    
    this.setTheme(GameTheme.classic);
  }

  setTheme(theme: GameTheme) {
    this.currentTheme = theme;
    this.themeColors = themes[theme];
  }
  
  startWithDifficulty(speed: number, interval: number) {
    this.soundManager.init();
    this.gameSpeed = speed;
    this.pipeSpawnInterval = interval;
    
    // Scale bird physics based on speed difficulty (normal is 250.0)
    const ratio = speed / 250.0;
    this.bird.gravity = 1500 * ratio;
    this.bird.jumpVelocity = -500 * ratio;
    
    this.startGame();
  }

  startGame() {
    this.setState(GameState.playing);
    this.score = 0;
    this.notifyScore();
    
    this.bird.reset();
    this.pipeManager.reset();
  }

  goToMainMenu() {
    this.setState(GameState.mainMenu);
    this.bird.reset();
    this.pipeManager.reset();
  }
  
  gameOver() {
    if (this.gameState === GameState.gameOver) return;
    this.soundManager.playHit();
    this.setState(GameState.gameOver);
  }

  increaseScore() {
    this.score++;
    this.soundManager.playScore();
    this.notifyScore();
  }
  
  setState(state: GameState) {
    this.gameState = state;
    if (this.onStateChange) {
      this.onStateChange(state);
    }
  }
  
  notifyScore() {
    if (this.onScoreChange) {
      this.onScoreChange(this.score);
    }
  }

  onTap() {
    this.soundManager.init();
    if (this.gameState === GameState.playing) {
      this.bird.jump();
      this.soundManager.playFlap();
    } else if (this.gameState === GameState.mainMenu) {
      this.startGame();
    }
  }

  start() {
    this.lastTime = performance.now();
    const loop = (time: number) => {
      const dt = (time - this.lastTime) / 1000;
      this.lastTime = time;
      
      this.update(dt);
      this.render();
      
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  update(dt: number) {
    // Prevent huge dt if tab was inactive
    if (dt > 0.1) dt = 0.1;
    
    this.pipeManager.update(dt);
    this.ground.update(dt);
    this.bird.update(dt);
  }

  render() {
    // Clear & background
    this.ctx.fillStyle = this.themeColors.sky;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Sort z-index (Flame order: pipeManager, ground, bird)
    this.pipeManager.render(this.ctx);
    this.ground.render(this.ctx);
    this.bird.render(this.ctx);
  }
}
