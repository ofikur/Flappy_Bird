import { GameEngine, GameState, GameTheme } from '../GameEngine';
import { Pipe } from './Pipe';
import { Ground } from './Ground';

export class Bird {
  game: GameEngine;
  
  x: number = 0;
  y: number = 0;
  width: number = 40;
  height: number = 40;
  
  gravity: number = 1500;
  jumpVelocity: number = -500;
  velocityY: number = 0;
  animationTimer: number = 0;
  angle: number = 0;
  
  // Hitbox circle: center is (x, y), radius 17
  hitboxRadius: number = 17;

  constructor(game: GameEngine) {
    this.game = game;
  }

  onGameResize(gameWidth: number, gameHeight: number) {
    if (this.game.gameState === GameState.mainMenu) {
      this.x = gameWidth / 4;
      this.y = gameHeight / 2;
    }
  }

  update(dt: number) {
    if (this.game.gameState === GameState.playing) {
      this.velocityY += this.gravity * dt;
      this.y += this.velocityY * dt;
      
      // Bird rotation matches velocity feeling
      this.angle = Math.max(-0.8, Math.min(0.8, this.velocityY * 0.0015));
      
      if (this.velocityY < 0) {
        this.animationTimer += dt * 1.5;
      } else {
        this.animationTimer += dt * 0.5;
      }
      
      // Prevent flying out of top
      if (this.y < this.height / 2) {
        this.y = this.height / 2;
        this.velocityY = 0;
      }

      this.checkCollision();
    }
  }
  
  checkCollision() {
    // Collision with ground
    const groundY = this.game.height - Ground.groundHeight;
    if (this.y + this.hitboxRadius >= groundY) {
      this.game.gameOver();
      return;
    }

    // Collision with pipes
    for (const pipe of this.game.pipeManager.pipes) {
      // Find closest point on AABB to circle
      const closestX = Math.max(pipe.x, Math.min(this.x, pipe.x + pipe.width));
      const closestY = Math.max(pipe.y, Math.min(this.y, pipe.y + pipe.height));

      // Calculate distance between circle's center and this closest point
      const distanceX = this.x - closestX;
      const distanceY = this.y - closestY;
      const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

      if (distanceSquared < (this.hitboxRadius * this.hitboxRadius)) {
        this.game.gameOver();
        return;
      }
    }
  }

  jump() {
    this.velocityY = this.jumpVelocity;
  }

  reset() {
    this.x = this.game.width / 4;
    this.y = this.game.height / 2;
    this.velocityY = 0;
    this.angle = 0;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // We used center anchor in flame, so top-left is (-width/2, -height/2)
    ctx.translate(-this.width / 2, -this.height / 2);

    switch (this.game.currentTheme) {
      case GameTheme.night:
        this._renderUFO(ctx);
        break;
      case GameTheme.desert:
        this._renderCubeBird(ctx);
        break;
      case GameTheme.classic:
      default:
        this._renderClassicBird(ctx);
        break;
    }
    
    ctx.restore();
  }

  _strokePath(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#000000'; // Pure crisp black for arcade feel
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  _renderClassicBird(ctx: CanvasRenderingContext2D) {
    const flap = Math.sin(this.animationTimer * 20) * 8;
    const beakOpen = Math.max(0, Math.sin(this.animationTimer * 15)) * 4; // Mouth animation!

    // Gradient Body
    const grad = ctx.createRadialGradient(20, 15, 2, 20, 18, 20);
    grad.addColorStop(0, '#FFF59D'); // Bright top highlight
    grad.addColorStop(0.4, '#FFEB3B'); // Classic yellow
    grad.addColorStop(1, '#F57F17'); // Dark orange-yellow bottom

    // Tail Feathers
    ctx.fillStyle = '#FF8F00';
    ctx.beginPath();
    ctx.moveTo(6, 14);
    ctx.lineTo(-6, 8);
    ctx.lineTo(-2, 18);
    ctx.lineTo(-8, 26);
    ctx.lineTo(6, 22);
    ctx.closePath();
    ctx.fill();
    this._strokePath(ctx);

    // Body Shape (ellipse logic)
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(20, 18, 16, 12, 0, 0, 2 * Math.PI);
    ctx.fill();
    this._strokePath(ctx);

    // Rosy cheek
    ctx.fillStyle = 'rgba(255, 138, 128, 0.8)';
    ctx.beginPath();
    ctx.ellipse(24, 22, 3, 2, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Dynamic Wing
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(10, 16);
    ctx.quadraticCurveTo(20, 16 - flap, 26, 18 - (flap / 2));
    ctx.quadraticCurveTo(18, 24 + (flap / 3), 10, 22);
    ctx.closePath();
    ctx.fill();
    this._strokePath(ctx);

    // Eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(30, 12, 6, 0, 2 * Math.PI);
    ctx.fill();
    this._strokePath(ctx);
    
    // Pupil
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(32, 12, 2.5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(33, 11, 1, 0, 2 * Math.PI);
    ctx.fill();

    // --- ANIMATED MOUTH ---
    // Top Beak
    ctx.fillStyle = '#FF7043';
    ctx.beginPath();
    ctx.moveTo(35, 14);
    ctx.lineTo(48, 16 - beakOpen);
    ctx.lineTo(35, 18 - beakOpen/2);
    ctx.closePath();
    ctx.fill();
    this._strokePath(ctx);

    // Bottom Beak
    ctx.fillStyle = '#E64A19';
    ctx.beginPath();
    ctx.moveTo(35, 18 + beakOpen/2);
    ctx.lineTo(44, 20 + beakOpen);
    ctx.lineTo(35, 22);
    ctx.closePath();
    ctx.fill();
    this._strokePath(ctx);
  }

  _renderUFO(ctx: CanvasRenderingContext2D) {
    const pulse = Math.abs(Math.sin(this.animationTimer * 10));

    // Jet Flame
    if (this.velocityY < 0) {
      const grad = ctx.createRadialGradient(20, 35 + (pulse * 5), 2, 20, 35, 10 + (pulse * 5));
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.5, '#00E5FF');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(20, 35, 8, 10 + (pulse * 5), 0, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.beginPath();
      ctx.ellipse(20, 30, 5, 4, 0, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Dome Background
    const domeGrad = ctx.createRadialGradient(20, 15, 2, 20, 15, 12);
    domeGrad.addColorStop(0, 'rgba(132, 255, 255, 1)');
    domeGrad.addColorStop(1, 'rgba(0, 229, 255, 0.2)');
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.arc(20, 15, 12, Math.PI, 0, false);
    ctx.fill();

    // Alien Pilot
    ctx.fillStyle = '#76FF03';
    ctx.beginPath();
    ctx.ellipse(20, 14, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Alien eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(18, 14, 1, 2, 0, 0, 2 * Math.PI); // left eye
    ctx.ellipse(22, 14, 1, 2, 0, 0, 2 * Math.PI); // right eye
    ctx.fill();

    // Dome Stroke
    ctx.beginPath();
    ctx.arc(20, 15, 12, Math.PI, 0, false);
    this._strokePath(ctx);

    // Body (ellipse dish)
    const dishGrad = ctx.createLinearGradient(0, 14, 0, 30);
    dishGrad.addColorStop(0, '#ECEFF1');
    dishGrad.addColorStop(0.5, '#90A4AE');
    dishGrad.addColorStop(1, '#546E7A');
    
    ctx.fillStyle = dishGrad;
    ctx.beginPath();
    ctx.ellipse(20, 22, 22, 8, 0, 0, 2 * Math.PI);
    ctx.fill();
    this._strokePath(ctx);

    // Blinking lights
    const t = this.animationTimer * 15;
    ctx.fillStyle = Math.sin(t) > 0 ? '#FF5252' : '#B0BEC5';
    ctx.beginPath(); ctx.arc(6, 22, 2.5, 0, Math.PI * 2); ctx.fill();
    
    ctx.fillStyle = Math.sin(t + 2) > 0 ? '#FFFF00' : '#B0BEC5';
    ctx.beginPath(); ctx.arc(20, 24, 2.5, 0, Math.PI * 2); ctx.fill();
    
    ctx.fillStyle = Math.sin(t + 4) > 0 ? '#18FFFF' : '#B0BEC5';
    ctx.beginPath(); ctx.arc(34, 22, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  _renderCubeBird(ctx: CanvasRenderingContext2D) {
    // Redesigned: DESERT EAGLE (Replaces the blocky bird)
    const flap = Math.sin(this.animationTimer * 20) * 10;
    const beakOpen = Math.max(0, Math.sin(this.animationTimer * 15)) * 4;

    // Body Gradient (Eagle Brown)
    const bodyGrad = ctx.createRadialGradient(18, 18, 3, 18, 18, 18);
    bodyGrad.addColorStop(0, '#8D6E63');
    bodyGrad.addColorStop(1, '#3E2723');

    // Tail Feathers (Sharp)
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.moveTo(8, 16);
    ctx.lineTo(-6, 12);
    ctx.lineTo(-2, 20);
    ctx.lineTo(-8, 26);
    ctx.lineTo(6, 24);
    ctx.closePath();
    ctx.fill();
    this._strokePath(ctx);

    // Body (Aerodynamic oval)
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(16, 20, 14, 10, 0.1, 0, 2 * Math.PI);
    ctx.fill();
    this._strokePath(ctx);

    // Head (White feathers bald eagle style)
    ctx.fillStyle = '#FAFAFA';
    ctx.beginPath();
    ctx.ellipse(26, 14, 10, 8, -0.1, 0, 2 * Math.PI);
    ctx.fill();
    this._strokePath(ctx);

    // Eye (Fierce Yellow)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.arc(30, 11, 4.5, 0, Math.PI*2); ctx.fill(); this._strokePath(ctx);
    ctx.fillStyle = 'black';
    ctx.beginPath(); ctx.arc(31, 11, 2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#FFEB3B';
    ctx.beginPath(); ctx.arc(31, 11, 0.8, 0, Math.PI*2); ctx.fill(); 

    // Angry Eyebrow (slanted)
    ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(26, 6); ctx.lineTo(34, 9); ctx.stroke();
    // Reset line width
    ctx.lineWidth = 3;

    // Wing (Sharp and fierce)
    const isUp = flap > 0;
    ctx.fillStyle = '#4E342E';
    ctx.beginPath();
    ctx.moveTo(12, 18);
    ctx.lineTo(24, 18);
    if (isUp) {
       ctx.lineTo(14, 6);
       ctx.lineTo(8, 10);
    } else {
       ctx.lineTo(14, 30);
       ctx.lineTo(8, 26);
    }
    ctx.closePath();
    ctx.fill();
    this._strokePath(ctx);
    
    // Wing highlight inner streak
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, 18);
    ctx.lineTo(22, 18);
    ctx.stroke();
    ctx.lineWidth = 3; // Reset

    // --- ANIMATED HOOKED BEAK ---
    // Top Beak (Hooked downwards)
    ctx.fillStyle = '#FFB300';
    ctx.beginPath();
    ctx.moveTo(35, 12);
    ctx.lineTo(46, 14 - beakOpen);
    ctx.quadraticCurveTo(48, 22 - beakOpen, 42, 19 - beakOpen/2);
    ctx.lineTo(33, 16);
    ctx.closePath();
    ctx.fill();
    this._strokePath(ctx);

    // Bottom Beak
    ctx.fillStyle = '#FFCA28';
    ctx.beginPath();
    ctx.moveTo(33, 17 + beakOpen/2);
    ctx.lineTo(40, 19 + beakOpen);
    ctx.lineTo(32, 21);
    ctx.closePath();
    ctx.fill();
    this._strokePath(ctx);
  }
}
