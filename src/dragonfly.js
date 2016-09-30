import ImgFile from '../images/dragonfly-bright.png';

const TWOPI = 2 * Math.PI;

const flightPaths = [
	{M: 120, N: 60, penRadius: -0.2, drawingRadius: 320, tilt: 0, name: 'vertical-ellipse', difficulty: 1},
	{M: 120, N: 80, penRadius: -0.2, drawingRadius: 600, tilt: 0, name: '3-leaf', difficulty: 3},	// pretty !
	{M: 96, N: 15, penRadius: 2, drawingRadius: 300, tilt: 0, name: 'flowery', difficulty: 1},
	{M: 96, N: 32, penRadius: 0.3, drawingRadius: 400, tilt: 0, name: 'guitar-pick', difficulty: 3},
	{M: 11, N: 44, penRadius: 2, drawingRadius: 30, tilt: 0, name: 'bacon-beast', difficulty: 3},
	{M: 96, N: 36, penRadius: 0.7, drawingRadius: 380, tilt: 0, name: 'star-8', difficulty: 3},
	{M: 120, N: 24, penRadius: 1.1, drawingRadius: 300, tilt: Math.PI / 4, name: 'pentagon', difficulty: 4},
	{M: 96, N: 32, penRadius: -1.2, drawingRadius: 380, tilt: Math.PI / 6, name: 'trillium-swoop', difficulty: 5},
	{M: 96, N: 24, penRadius: 1.3, drawingRadius: 320, tilt: Math.PI /2, name: 'box', difficulty: 6}, // pretty
	{M: 96, N: 48, penRadius: 1.8, drawingRadius: 600, tilt: 0, name: 'flyby-orbit', difficulty: 10},
	{M: 96, N: 21, penRadius: 2.7, drawingRadius: 700, tilt: 0, name: 'fast-swoop', difficulty: 11}
];

export default class Dragonfly {
	constructor(context, fieldWidth=640, fieldHeight=640) {
		this.context = context;
		this.fieldWidth = fieldWidth;
		this.fieldHeight = fieldHeight;
		this.imageLoaded = false;
		this.hitZoneY = -20; // offset relative to center of dragonfly
		this.hitZoneX = 0;
		this.Img = new Image();
		this.Img.onload = () => {
			this.imageLoaded = true; 
		};
		this.Img.src = ImgFile;
		this.hidden = true;
		this.animationFrame = 0;
		this.sequenceLength = 16384;
		this.reciprocalSequenceLength = 1.0 / this.sequenceLength;
	}

	selectFlightPathByName(name) {
		let params = flightPaths.filter(flightPath => flightPath.name === name)[0];
		if(params) {
			let paramsArr = Object.keys(params).map(key => params[key]);
			this.setPath(...paramsArr);
		}
	}

	// setPath(): precalculate flight path and store it in lookup table
	setPath(M, N, penRadius, drawingRadius, tilt=0) {
		const cx=this.fieldWidth / 2;
		const cy=this.fieldHeight / 2;
		this.path = [];
		let gearRatio = N / M;
		let inc = (TWOPI / this.sequenceLength);
		
		let lastX = (1 - gearRatio) + penRadius * gearRatio;		let lastY = 0;
		
		for (let t = 0; t < TWOPI;  t += inc) {
			let x = (1 - gearRatio) * Math.cos(tilt + N * t) + penRadius * (gearRatio) * Math.cos (tilt + (M - N) * t);
			let y = (1 - gearRatio) * Math.sin(tilt + N * t) - penRadius * (gearRatio) * Math.sin (tilt + (M - N) * t);
			let theta = -Math.PI/2 - Math.atan2(y-lastY, x-lastX);
			lastX = x;
			lastY = y;
			this.path.push({x: cx + x * drawingRadius, y: cy + y * drawingRadius, r: theta }); 
		}
	}

	drawNext() {
		if(this.animationFrame >= (this.sequenceLength-1)) {
			this.animationFrame = 0;
			console.log('Problem: animation frame beyond bounds');
		}
		const x = this.path[this.animationFrame].x;
		const y = this.path[this.animationFrame].y;
		const r = this.path[this.animationFrame].r;
		this.draw(x,y,r,0.33);
	}

	update() {
		this.animationFrame = this.animationFrame >= this.sequenceLength ? 0 : this.animationFrame + 1;
	}

	draw(x, y, rotation, scale=1.0) {
		
		if (this.hidden)
			return;
		
		const ctx = this.context;
		const imgWidth = this.Img.width * scale;
		const imgHeight = this.Img.height * scale;
		const imgCenterX = 0.5 * imgWidth;
		const imgCenterY = 0.5 * imgHeight+this.hitZoneY;

		ctx.save();
		ctx.globalAlpha = 0.8;
		ctx.translate(x, y);
		ctx.rotate(-rotation);
		ctx.drawImage(this.Img, -imgCenterX, -imgCenterY, imgWidth, imgHeight);
/*
		// show hitZone:
		ctx.beginPath();
				ctx.arc(0,0, 
			10, 0, TWOPI, false);
		
				ctx.lineWidth = 2;
				ctx.strokeStyle = '#330000';
				ctx.stroke();
*/
		ctx.restore();
	}

	isHit(direction) {

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
	}

	getPosition() {
		return({
			x: this.path[this.animationFrame].x,
			y: this.path[this.animationFrame].y
		});
	}

};