import { GameEngine, GameState } from '../GameEngine';

export class Pipe {
  game: GameEngine;
  
  x: number;
  y: number;
  width: number;
  height: number;
  isTopPipe: boolean;
  passed: boolean = false;

  constructor(game: GameEngine, x: number, y: number, width: number, height: number, isTopPipe: boolean) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isTopPipe = isTopPipe;
  }

  update(dt: number) {
    if (this.game.gameState === GameState.playing) {
      this.x -= this.game.gameSpeed * dt;

      // Score logic based on the Bird's X position.
      // Assuming bird is at x = width / 4 and has a width of 40 (center is at width/4)
      if (!this.passed && (this.x + this.width) < this.game.bird.x) {
        this.passed = true;
        if (!this.isTopPipe) {
          this.game.increaseScore();
        }
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const colors = this.game.themeColors;
    ctx.fillStyle = colors.pipe;
    ctx.strokeStyle = colors.pipeStroke;
    ctx.lineWidth = 3;

    // Main Body
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // End Cap
    const capHeight = 30;
    let capY = this.isTopPipe ? (this.y + this.height - capHeight) : this.y;
    
    const capRect = {
      x: this.x - 4,
      y: capY,
      width: this.width + 8,
      height: capHeight
    };

    ctx.fillRect(capRect.x, capRect.y, capRect.width, capRect.height);
    ctx.strokeRect(capRect.x, capRect.y, capRect.width, capRect.height);

    // Shiny highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    
    // Body highlight
    ctx.fillRect(this.x + 8, this.y, 8, this.height);
    
    // Cap highlight
    ctx.fillRect(capRect.x + 8, capRect.y, 8, capRect.height);
  }
}
