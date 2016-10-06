import weevilNImgFile from '../images/WeevilN_75px_3.png';
import weevilEImgFile from '../images/WeevilE_75px_3.png';
import weevilSImgFile from '../images/WeevilS_75px_3.png';
import weevilWImgFile from '../images/WeevilW_75px_3.png';

export default class weevilCollection {
	constructor(context, fieldWidth=640, fieldHeight=640) {
		this.context = context;
		this.fieldWidth = fieldWidth;
		this.fieldHeight = fieldHeight;
		this.centerX = fieldWidth / 2;
		this.centerY = fieldHeight / 2;
		this.weevilRadius = 37;
		this.weevilMargin = 10;
		this.maxWeevils = 4; 
		this.weevils = [];

		this._loadImages();
		this._setWeevilPositions();
	}

	_loadImages() {
		this.weevilN = new Image();
		this.weevilE = new Image();
		this.weevilS = new Image();
		this.weevilW = new Image();

		this.weevilN.onload = () => {this.weevilNLoaded = true;};     
		this.weevilE.onload = () => {this.weevilNLoaded = true;};
		this.weevilS.onload = () => {this.weevilNLoaded = true;};
		this.weevilW.onload = () => {this.weevilWLoaded = true;};

		this.weevilN.src = weevilNImgFile;
		this.weevilE.src = weevilEImgFile;
		this.weevilS.src = weevilSImgFile;
		this.weevilW.src = weevilWImgFile;
	}

	_setWeevilPositions() {
		this.weevilNpos = {x: this.centerX - this.weevilRadius, y: this.weevilMargin};
		this.weevilEpos = {x: this.fieldWidth - 2 * this.weevilRadius - this.weevilMargin, y: this.centerY - this.weevilRadius};
		this.weevilSpos = {x: this.centerX-this.weevilRadius, y: this.fieldHeight - 2 * this.weevilRadius - this.weevilMargin};
		this.weevilWpos = {x: this.weevilMargin, y: this.centerY - this.weevilRadius}; 
	}

	setWeevilMargin(weevilMargin) {
		this.weevilMargin = weevilMargin;
		this._setWeevilPositions();
	}

	// getWeevilPosition() : returns coordinates of _center_ of weevil
	getWeevilPosition(direction) {
			switch(direction){		
					case 'N':
						return ({x: this.weevilNpos.x +this.weevilRadius, y:this.weevilNpos.y +this.weevilRadius});
					case 'E':
						return ({x: this.weevilEpos.x +this.weevilRadius, y:this.weevilEpos.y +this.weevilRadius});
					case 'S':           
						return ({x: this.weevilSpos.x +this.weevilRadius, y:this.weevilSpos.y +this.weevilRadius});
					case 'W':
						return ({x: this.weevilWpos.x +this.weevilRadius, y:this.weevilWpos.y +this.weevilRadius});
					default:
				}
	}

	drawNext() {
		const ctx = this.context;
		ctx.save();
		ctx.globalAlpha = 1;

		for(let i=0; i<this.weevils.length; i++){
			let weevil = this.weevils[i];
			if(weevil.ready){
				switch(weevil.direction){
					
					case 'N':
					ctx.drawImage(this.weevilN, this.weevilNpos.x, this.weevilNpos.y);
					break;
					
					case 'E':
					ctx.drawImage(this.weevilE, this.weevilEpos.x, this.weevilEpos.y);
					break; 
					
					case 'S':           
					ctx.drawImage(this.weevilS, this.weevilSpos.x, this.weevilSpos.y);
					break; 
					
					case 'W':
					ctx.drawImage(this.weevilW, this.weevilWpos.x, this.weevilWpos.y);
					break;
					
					default:  
				}
			}
		}

		ctx.restore();
	}

	update() {
		while(this.weevils.length < this.maxWeevils) {
			const weevilDirections = ['N','E','S','W'];
			for(let i=0; i<weevilDirections.length; i++) {
				let direction = weevilDirections[i];
				if (this.weevils.filter((weevil)=>weevil.direction === direction)[0] === undefined) { // IE11 compatibility: x.filter(f)[0] subsituted for x.find(f)
					this.hatchWeevil(direction);
				}
			}
		}
  }

  hatchWeevil(direction) {
		let newWeevil = {direction: direction, ready: false};
		this.weevils.push(newWeevil);
		setTimeout(
			() => {newWeevil.ready=true;}, 
			500 + Math.floor(Math.random()*5500) // 1-8 seconds // to-do: replace 1000 and 8000 ...
		);
  }

	allDead()  {
		for(let i = 0; i < this.weevils.length; i++) {
			if (this.weevils[i].ready)
				return false;
		}
		return true;
	}

};
