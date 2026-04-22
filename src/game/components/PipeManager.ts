import { GameEngine, GameState } from '../GameEngine';
import { Pipe } from './Pipe';
import { Ground } from './Ground';

export class PipeManager {
  game: GameEngine;
  timer: number = 0;
  pipes: Pipe[] = [];

  constructor(game: GameEngine) {
    this.game = game;
  }

  update(dt: number) {
    if (this.game.gameState === GameState.playing) {
      this.timer += dt;
      if (this.timer > this.game.pipeSpawnInterval) {
        this.timer = 0;
        this.spawnPipes();
      }

      // Update pipes and remove off-screen ones
      this.pipes.forEach(pipe => pipe.update(dt));
      this.pipes = this.pipes.filter(pipe => pipe.x + pipe.width > -50);
    }
  }

  spawnPipes() {
    const gapSize = 160.0;
    const pipeWidth = 60.0;
    
    const screenHeight = this.game.height - Ground.groundHeight;
    const minGapCenter = 120.0;
    const maxGapCenter = screenHeight - 120.0;

    const gapCenter = minGapCenter + Math.random() * (maxGapCenter - minGapCenter);

    const topPipeHeight = gapCenter - (gapSize / 2);
    const bottomPipeHeight = screenHeight - (gapCenter + (gapSize / 2));

    const topPipe = new Pipe(
      this.game,
      this.game.width,
      0,
      pipeWidth,
      topPipeHeight,
      true
    );

    const bottomPipe = new Pipe(
      this.game,
      this.game.width,
      screenHeight - bottomPipeHeight,
      pipeWidth,
      bottomPipeHeight,
      false
    );

    this.pipes.push(topPipe);
    this.pipes.push(bottomPipe);
  }

  render(ctx: CanvasRenderingContext2D) {
    // Render all pipes
    this.pipes.forEach(pipe => pipe.render(ctx));
  }

  reset() {
    this.pipes = [];
    this.timer = this.game.pipeSpawnInterval; // Spawn immediately on restart
  }
}
