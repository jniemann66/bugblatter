import dragonBallImgFile from '../images/dragonBall.png';

export default class DragonBallCollection {
	constructor(context, fieldWidth=640, fieldHeight=640) {
		this.context = context;
		this.fieldWidth = fieldWidth;
		this.fieldHeight = fieldHeight;
		this.imageLoaded = false;
		this.Img = new Image();
		this.Img.onload = () => {
			this.imageLoaded = true; 
		};
		this.Img.src = dragonBallImgFile;
		this.hidden = true;

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
		
		console.log(dragonBalls.length);

		for(let i = 0; i < dragonBalls.length; ++i) {
			let dragonBall = dragonBalls[i];
			if(!dragonBall.isHidden) {
				ctx.drawImage(this.Img, dragonBall.x - imgCenterX,  dragonBall.y - imgCenterY);
			}
		}
		ctx.restore();
	}

	update() {
		// displacement
		// velocity
		// acceleration
	}

	isHit(direction) {
/*
		if (this.hidden)
			return false;
		
		const x = this.path[this.animationFrame].x;
		const y = this.path[this.animationFrame].y;
		const cx = this.fieldWidth / 2;
		const cy = this.fieldHeight / 2;
		const hitRadius = 10;

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

*/

	}


/*
	getPosition() {
		return({
			x: this.path[this.animationFrame].x,
			y: this.path[this.animationFrame].y
		});
	}
*/

};