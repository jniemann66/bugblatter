import baseImgFile from '../images/Base_150px.png';

export default class LaserBase {
	 constructor(context, fieldWidth=640, fieldHeight=640) {
		this.context = context;
		this.fieldWidth = fieldWidth;
		this.fieldHeight = fieldHeight;
		this.centerX = fieldWidth / 2;
		this.centerY = fieldHeight / 2;
		this.baseImgWidth = 150;
		this.baseRadius = Math.floor(this.baseImgWidth / 2); 
		this.drawPosX = this.centerX - this.baseRadius;
		this.drawPosY = this.centerY - this.baseRadius; 
		this.bugRadius = 37;
		this.bugMargin = 10;
		this.maxBugs = 4; 
		this.spitballRadius = 15;
		this.maxSpitballs = 8;
		this.spitballLength = 28;
		this.laserOriginRadius = 60;
		this.spitballs = [];

		this.baseImg = new Image();
		this.baseImg.onload = () => {
			this.imageLoaded = true; 
		};
		this.baseImg.src = baseImgFile;
	}

	drawNext() {
		const ctx = this.context;
		ctx.save();
		ctx.globalAlpha = 1;
		ctx.drawImage(this.baseImg, this.drawPosX, this.drawPosY);
		ctx.restore();
	} 
 
	drawLaserBeam(direction,finishPosition) {
		const ctx = this.context;
		ctx.save();
		ctx.strokeStyle = "#ff0000";
		ctx.lineWidth = 3;
		ctx.globalApha = 1;
		switch(direction) {
			case 'N':
				ctx.beginPath();
				ctx.moveTo(this.centerX,this.centerY-this.laserOriginRadius);
				ctx.lineTo(this.centerX,finishPosition);
				ctx.stroke();
				break;
			case 'S':
				ctx.beginPath();
				ctx.moveTo(this.centerX,this.centerY+this.laserOriginRadius);
				ctx.lineTo(this.centerX, this.fieldHeight - finishPosition);
				ctx.stroke();
				break;
			case 'W':
				ctx.beginPath();
				ctx.moveTo(this.centerX-this.laserOriginRadius,this.centerY);
				ctx.lineTo(finishPosition,this.centerY);
				ctx.stroke();
				break;
			case 'E':
				ctx.beginPath();
				ctx.moveTo(this.centerX+this.laserOriginRadius,this.centerY);
				ctx.lineTo(this.fieldWidth-finishPosition,this.centerY);
				ctx.stroke();
				break;
			default:
		}
		ctx.restore();
	}
};