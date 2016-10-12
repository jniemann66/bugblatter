import dragonballImgFile from '../images/dragonball.png';

export default class DragonballCollection {
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
		this.Img.src = dragonballImgFile;

		this.attraction = 2.5; // gravitational strength
		this.drag = 0.001;	// drag acting on dragonball, causing orbital decay ...

		this.dragonballs = [];
	}

	drawNext() {
		const ctx = this.context;
		const imgWidth = this.Img.width;
		const imgHeight = this.Img.height;
		const imgCenterX = 0.5 * imgWidth;
		const imgCenterY = 0.5 * imgHeight;
		const dragonballs = this.dragonballs;
		
		ctx.save();
		ctx.globalAlpha = 0.8;

		for(let i = 0; i < dragonballs.length; ++i) {
			let dragonball = dragonballs[i];
			if(!dragonball.isHidden) {
				ctx.drawImage(this.Img, dragonball.x - imgCenterX,  dragonball.y - imgCenterY);
			}
		}
		ctx.restore();
	}

	update(onHit) { // onHit will be called when a dragonball has hit the base.
		let dragonballs = this.dragonballs;

		for(let i = dragonballs.length-1; i >= 0; --i) {
			let dragonball = dragonballs[i];

			// update displacement:
			dragonball.x += dragonball.vx;
			dragonball.y += dragonball.vy;

			// check for collision with base:
			// to-do: use circular hit-zone instead of box ?
			if(
				(dragonball.x > (this.centerX - this.baseRadius)) &&
				(dragonball.x < (this.centerX + this.baseRadius)) &&
				(dragonball.y > (this.centerY - this.baseRadius)) &&
				(dragonball.y < (this.centerY + this.baseRadius))
				) {
					onHit(dragonball.x-this.Img.width, dragonball.y-this.Img.height);
					dragonballs.splice(i,1);
			}

			// update velocity
			let dx = this.centerX - dragonball.x;
			let dy = this.centerY - dragonball.y;
			let d2 = Math.pow(dx,2) + Math.pow(dy,2);

			dragonball.vx = dragonball.vx * (1 - this.drag) + this.attraction * dx / d2;
			dragonball.vy = dragonball.vy * (1 - this.drag) + this.attraction * dy / d2;
		}

		// update acceleration (?)
	}

	isHit(index, direction) {
		const x = this.dragonballs[index].x;
		const y = this.dragonballs[index].y;
		const cx = this.centerX;
		const cy = this.centerY;
		const hitRadius = this.Img.width;

		// to-do: circular hit-zone ?
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
		this.dragonballs = [];
	}
};