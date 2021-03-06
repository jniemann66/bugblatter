import ImgFile from '../images/dragonfly-bright.png';

const TWOPI = 2 * Math.PI;
const HALFPI = Math.PI / 2;

const flightPaths = [ // note: parameters must be in correct order (M, N, penRadius, drawingRadius, tilt)
	{M: 120, N: 60, penRadius: -0.2, drawingRadius: 320, tilt: 0, name: 'vertical-ellipse'},
	{M: 120, N: 80, penRadius: -0.2, drawingRadius: 600, tilt: 0, name: '3-leaf'},	// pretty !
	{M: 96, N: 15, penRadius: 2, drawingRadius: 300, tilt: 0, name: 'flowery'},
	{M: 96, N: 32, penRadius: 0.3, drawingRadius: 400, tilt: 0, name: 'guitar-pick'},
	{M: 11, N: 44, penRadius: 2, drawingRadius: 30, tilt: 0, name: 'bacon-beast'},
	{M: 96, N: 36, penRadius: 0.7, drawingRadius: 380, tilt: 0, name: 'star-8'},
	{M: 120, N: 24, penRadius: 1.1, drawingRadius: 300, tilt: Math.PI / 4, name: 'pentagon'},
	{M: 96, N: 32, penRadius: -1.2, drawingRadius: 380, tilt: Math.PI / 6, name: 'trillium-swoop'},
	{M: 96, N: 24, penRadius: 1.3, drawingRadius: 320, tilt: Math.PI /2, name: 'box'}, // pretty
	{M: 96, N: 48, penRadius: 1.8, drawingRadius: 400, tilt: 0, name: 'flyby-orbit'},
	{M: 96, N: 24, penRadius: 2.7, drawingRadius: 700, tilt: 0, name: 'fast-swoop'},
	{M: 96, N: 24, penRadius: -1.01, drawingRadius: 300, tilt: -Math.PI / 8, name: 'ninja'},
	{M: 120, N: 140, penRadius: 0.92, drawingRadius: 220, tilt: Math.PI / 8, name: 'hex-attack'},	// pretty !
	{M: 120, N: 150, penRadius: 0.85, drawingRadius: 220, tilt: Math.PI / 4, name: 'spray-tan'}
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
		let params = flightPaths.filter(flightPath => flightPath.name === name)[0]; // IE doesn't have find()
		if(params) {

			/*
			let paramsArr = Object.keys(params).map(key => params[key]);
			this.setPath(...paramsArr); 	// Warning: assumes insertion order of object properties is preserved. 
			// The ECMA-262 standard doesn't define any particular order, but in PRACTICE, all Javascript engines I have tested preserve the order of 
			// object properties with non-numeric keys. (they sort the order of properties with numeric keys in ascending order)
			*/

			// safer method (using destructuring)
			let M, N, penRadius, drawingRadius, tilt;
			({M, N, penRadius, drawingRadius, tilt} = params);
			this.setPath(M, N, penRadius, drawingRadius, tilt); 
			
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
			let theta = -HALFPI - Math.atan2(y-lastY, x-lastX);
			lastX = x;
			lastY = y;
			this.path.push({x: cx + x * drawingRadius, y: cy + y * drawingRadius, r: theta }); 
		}
	}

	drawNext() {
		if(this.animationFrame > (this.sequenceLength-1)) {
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
			y: this.path[this.animationFrame].y,
			r: this.path[this.animationFrame].r
		});
	}

};