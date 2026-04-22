import { GameEngine, GameState } from '../GameEngine';

export class Ground {
  static groundHeight: number = 112;
  
  game: GameEngine;
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = Ground.groundHeight;
  
  scrollX: number = 0;

  constructor(game: GameEngine) {
    this.game = game;
  }

  onGameResize(gameWidth: number, gameHeight: number) {
    this.width = gameWidth;
    this.y = gameHeight - this.height;
  }

  update(dt: number) {
    if (this.game.gameState === GameState.playing) {
      this.scrollX += this.game.gameSpeed * dt;
      if (this.scrollX > 40) {
        this.scrollX = 0;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const colors = this.game.themeColors;
    
    // Dirt
    ctx.fillStyle = colors.dirt;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Grass
    ctx.fillStyle = colors.grass;
    ctx.fillRect(this.x, this.y, this.width, 15);
    
    // Stroke
    ctx.strokeStyle = colors.pipeStroke;
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.width, 15);
    
    // Moving stripes
    ctx.strokeStyle = colors.pipeStroke;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3; // withOpacity(0.3)
    ctx.beginPath();
    
    for (let i = -40; i < this.width; i += 40) {
      // Draw diagonal line
      ctx.moveTo(i - this.scrollX + 15, this.y);
      ctx.lineTo(i - this.scrollX + 5, this.y + 15);
    }
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }
}
