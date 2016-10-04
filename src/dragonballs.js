import dragonBallImgFile from '../images/dragonBall.png';

export default class DragonBallCollection {
	constructor(context, fieldWidth=640, fieldHeight=640) {
		this.context = context;
		this.fieldWidth = fieldWidth;
		this.fieldHeight = fieldHeight;
		this.centerX = fieldWidth / 2;
		this.centerY = fieldWidth / 2;
		this.baseRadius = 30; // controls how far dragonball can penetrate base before considered a hit
		this.imageLoaded = false;
		this.Img = new Image();
		this.Img.onload = () => {
			this.imageLoaded = true; 
		};
		this.Img.src = dragonBallImgFile;

		this.attraction = 2;
		this.drag = 0.0001;

		this.dragonBalls = [];
	}

	drawNext() {
		const ctx = this.context;
		const imgWidth = this.Img.width;
		const imgHeight = this.Img.height;
		const imgCenterX = 0.5 * imgWidth;
		const imgCenterY = 0.5 * imgHeight;
		const dragonBalls = this.dragonBalls;
		
		ctx.save();
		ctx.globalAlpha = 0.8;

		for(let i = 0; i < dragonBalls.length; ++i) {
			let dragonBall = dragonBalls[i];
			if(!dragonBall.isHidden) {
				ctx.drawImage(this.Img, dragonBall.x - imgCenterX,  dragonBall.y - imgCenterY);
			}
		}
		ctx.restore();
	}

	update(onHit) { // onHit will be called when a Dragonball has hit the base.
		let dragonBalls = this.dragonBalls;

		for(let i = dragonBalls.length-1; i >= 0; --i) {
			let dragonBall = dragonBalls[i];

			// update displacement:
			dragonBall.x += dragonBall.vx;
			dragonBall.y += dragonBall.vy;

			// check for collision with base:

			if(
				(dragonBall.x > (this.centerX - this.baseRadius)) &&
				(dragonBall.x < (this.centerX + this.baseRadius)) &&
				(dragonBall.y > (this.centerY - this.baseRadius)) &&
				(dragonBall.y < (this.centerY + this.baseRadius))
				) {
					onHit(dragonBall.x-this.Img.width, dragonBall.y-this.Img.height);
					dragonBalls.splice(i,1);
			}

			// update velocity
			let dx = this.centerX - dragonBall.x;
			let dy = this.centerY - dragonBall.y;
			let d2 = Math.pow(dx,2) + Math.pow(dy,2);

			dragonBall.vx = dragonBall.vx * (1 - this.drag) + this.attraction * dx / d2;
			dragonBall.vy = dragonBall.vy * (1 - this.drag) + this.attraction * dy / d2;
		}

		// acceleration
	}

	isHit(index, direction) {
		const x = this.dragonBalls[index].x;
		const y = this.dragonBalls[index].y;
		const cx = this.centerX;
		const cy = this.centerY;
		const hitRadius = this.Img.width;

		switch(direction) {
			case 'N':
				if ((y < cy) && (x>=cx-hitRadius) && (x<=cx+hitRadius)) {
					return true;
				}
				break;

			case 'E':
				if ((x > cx) && (y>=cy-hitRadius) && (y<=cy+hitRadius)) {
					return true;
				}
				break;

			case 'S':
				if ((y > cy) && (x>=cx-hitRadius) && (x<=cx+hitRadius)) {
					return true;
				}
				break;

			case 'W':
				if ((x < cx) && (y>=cy-hitRadius) && (y<=cy+hitRadius)) {
					return true;
				}
				break;

			default:
				break;
		}
		return false;
	}

	clear() {
		this.dragonBalls = [];
	}
};