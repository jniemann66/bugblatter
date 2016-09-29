import spitballNImgFile from '../images/spitBallN.png';
import spitballEImgFile from '../images/spitBallE.png';
import spitballSImgFile from '../images/spitBallS.png';
import spitballWImgFile from '../images/spitBallW.png';

export default class SpitballCollection {
	 constructor(context, fieldWidth=640, fieldHeight=640) {
		this.context = context;
		this.fieldWidth = fieldWidth;
		this.fieldHeight = fieldHeight;
		this.centerX = fieldWidth / 2;
		this.centerY = fieldHeight / 2;
		this.bugRadius = 37;
		this.bugMargin = 10;
		this.maxBugs = 4; 
		this.spitballRadius = 15;
    this.maxDistance = 245;

    this._initStartPositions();

		this.spitballLength = 28;
		this.spitballs = [];
		this._loadImages();
	}

  _initStartPositions() {
    this.spitballNstartpos = {x: this.centerX-this.spitballRadius, y: this.bugMargin};
    this.spitballEstartpos = {x: this.fieldWidth - 2 * this.spitballRadius  - this.bugMargin, y: this.centerY - this.spitballRadius};
    this.spitballSstartpos = {x: this.centerX - this.spitballRadius, y: this.fieldHeight - 2 * this.spitballRadius - this.bugMargin};
    this.spitballWstartpos = {x: this.bugMargin, y: this.centerY - this.spitballRadius};
  }

	_loadImages() {
		this.spitballN = new Image();
		this.spitballE = new Image();
		this.spitballS = new Image();
		this.spitballW = new Image();

		this.spitballN.onload = () => {this.spitballNLoaded = true;};     
		this.spitballE.onload = () => {this.spitballNLoaded = true;};
		this.spitballS.onload = () => {this.spitballNLoaded = true;};
		this.spitballW.onload = () => {this.spitballWLoaded = true;};

		this.spitballN.src = spitballNImgFile;
		this.spitballE.src = spitballEImgFile;
		this.spitballS.src = spitballSImgFile;
		this.spitballW.src = spitballWImgFile;
	}

	drawNext() {
		const ctx = this.context;
		ctx.save();
		ctx.globalAlpha = 0.7;

		for(let i=0; i<this.spitballs.length; i++){
			
			let spitball = this.spitballs[i];
			
			if(spitball.ready) {  
				switch(spitball.direction){
           case 'N':
						ctx.drawImage(this.spitballN, 
							this.spitballNstartpos.x, 
							this.spitballNstartpos.y + spitball.position);
						break;
					case 'E':
						ctx.drawImage(this.spitballE, 
							this.spitballEstartpos.x - spitball.position, 
							this.spitballEstartpos.y);
						break; 
					case 'S':
						ctx.drawImage(this.spitballS,
							this.spitballSstartpos.x, 
							this.spitballSstartpos.y - spitball.position);
						break; 
					case 'W':
						ctx.drawImage(this.spitballW,
							this.spitballWstartpos.x + spitball.position,
							this.spitballWstartpos.y);
            break;
          default:
				}
			}
		}
		ctx.restore();
	}

	update(onHit) {
			// move existing spitballs if they are ready:
		for(let i=0; i<this.spitballs.length; i++) {
			let spitball = this.spitballs[i];
			if(spitball.ready) {
				spitball.position += spitball.speed;
				if(spitball.position >= this.maxDistance) {
					onHit(); // call the collision handler
				}
			}
		}
	}
 
	launchSpitball(direction) {
		let speed=0.25+Math.random()*2.75;
		let newSpitball = {direction: direction, position: this.bugRadius, speed: speed, ready: false};
		this.spitballs.push(newSpitball);
		setTimeout(
			() => {newSpitball.ready=true;}, 
			10 + Math.floor(Math.random()*3000) // 10ms-2.01 seconds // to-do: replace raw numbers ...
		);
	}

	cancelSpitballs(direction) {
		for (let i = this.spitballs.length-1; i>=0; i--) {
				if(this.spitballs[i].direction === direction)
					this.spitballs.splice(i,1);
		}
	}
}