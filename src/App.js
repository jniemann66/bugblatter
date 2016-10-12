import React, { Component } from 'react';
import Dragonfly from './dragonfly.js';
import dragonballCollection from './dragonballs.js';
import WeevilCollection from './weevils.js';
import SpitballCollection from './spitballs.js';
import LaserBase from './laserbase.js';
import ExplosionCollection from './explosions.js';
import { testLineCircleIntersection } from './utility.js';
import { isHeadedTowards } from './utility.js';
import { levels } from './levels.js';
import SoundCollection from './sounds.js';

import './App.css';

const TWOPI = 2 * Math.PI;
const HALFPI = Math.PI / 2;

class App extends Component {

	// Construction ////

	constructor(props) {
		super(props);
		this.state = {

			// global game parameters
			context: null,				// canvas context (not to be confused with React context)
			fieldWidth: 640,			// width of game
			fieldHeight: 640,			// height of game
			canvasWidth: 640,			// width of canvas
			canvasHeight: 640,		// height of canvas
			offsetLeft: null,			// horizontal start coordinate of playfield relative to canvas
			offsetTop: null,			// vertical start coordinate of playfield relative to canvas
			scale: null,					// scale of game playfield (canvas pixel : game pixel ratio)
			laserOriginRadius: 60,// defines the radius at which laser beam emerges from base

			// level / difficulty parameters
			laserCooldown: 5,			// number of frames before laser can be fired again
			dragonballLaunchWait: 5, // number of frames before another dragonball can be launched
			maxSpitballs: 8,
			maxDragonballs: 4,
			dragonflyNoShootRadius: 60, // determines circular area around base which dragonfly will not shoot (0 = maximum shooting accuracy)
			dragonflyFlightPath: 'vertical-ellipse',
			weevilMargin: 10,			// distance of weevils from edge of screen

			// game tracking
			dragonballLaunchCountdown: 0,
			bases: 3,
			score: 0,
			highScore: 0,
			level: 1,
			inGame: false,
			paused: false,
			laserNTemp: 0,
			laserETemp: 0,
			laserSTemp: 0,
			laserWTemp: 0,
			readyToPlay: true,
			nextWeevilToSpit: 0,
			wavesCleared: 0,
		}
		
		this.weevilCollection = null;
		this.dragonfly = null;
		this.spitballCollection = null;
		this.dragonballCollection = null;
		this.explosionCollection = null;
		this.animationTimer = null;
		this.soundCollection = null;
	}

	// Lifecycle Events ////

	componentWillMount() {

	}

	componentDidMount() {
		const context = this.refs.canvas.getContext('2d');
		this.fitToViewport(context); // resize the canvas and scale the playfield if it's too large

		this.setState({
			context: context,
		});
		
		this.laserBase = new LaserBase(context, this.fieldWidth, this.fieldHeight);
		this.dragonfly = new Dragonfly(context, this.fieldWidth, this.fieldHeight);
		this.weevilCollection = new WeevilCollection(context, this.fieldWidth, this.fieldHeight);
		this.spitballCollection = new SpitballCollection(context, this.fieldWidth, this.fieldHeight);
		this.explosionCollection = new ExplosionCollection(context, this.fieldWidth, this.fieldHeight);
		this.dragonballCollection = new dragonballCollection(context, this.fieldWidth, this.fieldHeight);
		this.soundCollection = new SoundCollection();
		this.dragonfly.hidden = true;

		// detect if device is iOS:
		let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
		
		// Activate sound:
		if (iOS) { // on iOS device, activate sound system upon receiving first touchend event
				window.addEventListener('touchend', this._touchEnd.bind(this), {once: true});
		} else { // on non-iOS devices, activate sound system immdediately
			this.soundCollection.activateSound();
		}

		// register event listeners:
		window.addEventListener('keydown', this._keyDown.bind(this));
		window.addEventListener('touchstart', this._touchStart.bind(this));
		window.addEventListener('mousedown', this._mouseDown.bind(this));
		window.addEventListener('resize', this._resize.bind(this));

		this.animationTimer = setInterval(this._update.bind(this),1000 / this.props.framesPerSecond); // 60fps = 16.67ms
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		if(nextState.canvasWidth !== this.state.canvasWidth || nextState.canvasHeight !== this.state.canvasHeight) {
			return true;
		} else {
			return false;
		}
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this._keyDown.bind(this));
		window.removeEventListener('touchstart', this._touchStart.bind(this));
		window.removeEventListener('mousedown', this._mouseDown.bind(this));
		window.removeEventListener('resize', this._resize.bind(this));

		clearInterval(this.animationTimer);
	}

	// Event Handling ////
	_update() {

		if(this.state.paused)
			return;

		if(this.state.inGame){

			// clear
			this.clearPlayField();

			// draw
			this.drawAll();

			this.weevilCollection.update();
			this.launchNewSpitballs();
			this.launchNewDragonballs();

			this.spitballCollection.update(() => { /* onHit */
				this.soundCollection.playBasedeath();
				this.clearEnemies();
				this.clearPlayField('#ff0000'); // red flash
				this.setState({bases: this.state.bases-1});
				if(this.state.bases <= 0)
					this.endGame();
			});

			this.dragonballCollection.update((x,y) => { /* onHit */
				this.soundCollection.playBasedeath();
				this.clearPlayField('#ff0000'); // red flash
				this.clearEnemies();
				this.explosionCollection.add(x, y, 1.0);
				setTimeout(()=>{
					this.setState({bases: this.state.bases-1});
					if(this.state.bases <= 0)
						this.endGame();
				},1000);
			});

			this.coolLasers();
			this.dragonfly.update();
			this.explosionCollection.update();

		} else {
			if(this.state.readyToPlay){
				this.clearPlayField();
				this.drawStartScreen();
			}
		}
	}

	_keyDown(evt) {

		if(this.state.inGame){

			switch(evt.key) {
				case 'ArrowUp':
				case 'Up': // IE 
					this.fireLaser('N');
					break;
				case 'ArrowDown':
				case 'Down': // IE
					this.fireLaser('S');
					break;
				case 'ArrowLeft':
				case 'Left': // IE
					this.fireLaser('W');
					break;
				case 'ArrowRight':
				case 'Right': // IE
					this.fireLaser('E');
					break;
				case 'p':
					this.togglePause();
					break;
				case 't':
					let newlvl = Number(prompt("Select Level",this.state.level));
					if(newlvl) {
						this.setState({level: newlvl});
						this.loadLevel(newlvl);
					}

					// test
					break;
				default:
			}
		} else {
			if(this.state.readyToPlay)
				this.startGame();
		}
	}

	_touchStart(evt) {

		evt.preventDefault(); // stop annoying panning / zooming behaviour in browser (IOS)
		const ctx = this.state.context;
		const h = ctx.canvas.height;
		const w = ctx.canvas.width;
		let canvasX = evt.targetTouches[0].pageX - ctx.canvas.offsetLeft;
		let canvasY = evt.targetTouches[0].pageY - ctx.canvas.offsetTop;
		
		if (canvasX <= 0 || canvasY < 0 || canvasX > ctx.canvas.width || canvasY > ctx.canvas.height) {
			// outside the canvas
			return;
		}

		let m = w / h;
		let n = h / w;
		let ma = canvasX / canvasY;
		let mb = (h - canvasY) / canvasX;

		let zone = '';

		/*
		// for debugging:
		// console.log(h,w,canvasX,canvasY);
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.strokeStyle = "#0000ff";
		ctx.moveTo(0,0);
		ctx.lineTo(w,h);
		ctx.stroke();
		
		ctx.moveTo(w,0);
		ctx.lineTo(0,h);
		ctx.stroke();
		ctx.restore();		
		*/

		if (ma > m) {
			
			if (mb > n) {
				zone = 'N';
			} else {
				zone = 'E';
			}
			
		} else {
			
			if (mb > n) {
				zone = 'W';
			} else {
				zone = 'S';
			}
		}

		if(this.state.inGame) {
			this.fireLaser(zone);
		} else {
			if(this.state.readyToPlay)
				this.startGame();
		}

	}

	_touchEnd(evt) {
	
		// kickstart iOS sound system (as of iOS9, must be executed inside a tounchend event)
		this.soundCollection.activateSound();

	}

	_mouseDown(evt) {

		const ctx = this.state.context;
		const h = ctx.canvas.height;
		const w = ctx.canvas.width;
		let canvasX = evt.pageX - ctx.canvas.offsetLeft;
		let canvasY = evt.pageY - ctx.canvas.offsetTop;

		if (canvasX <= 0 || canvasY < 0 || canvasX > w || canvasY > h) {
			// outside the canvas
			return;
		}

		let m = w / h;
		let n = h / w;
		let ma = canvasX / canvasY;
		let mb = (h - canvasY) / canvasX;

		let zone = '';

		/*
		// for debugging:
		// console.log(h,w,canvasX,canvasY);
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.strokeStyle = "#00ff00";
		ctx.moveTo(0,0);
		ctx.lineTo(w,h);
		ctx.stroke();
		
		ctx.moveTo(w,0);
		ctx.lineTo(0,h);
		ctx.stroke();
		ctx.restore();		
		*/		

		if (ma > m) {
			
			if (mb > n) {
				zone = 'N';
			} else {
				zone = 'E';
			}
			
		} else {
			
			if (mb > n) {
				zone = 'W';
			} else {
				zone = 'S';
			}	
		}

		if(this.state.inGame) {
			this.fireLaser(zone);
		} else {
			if(this.state.readyToPlay)
				this.startGame();
		}
		
	}
	
	_resize(evt) {
		this.fitToViewport(this.state.context, 100 /* percentOfViewport */);
		if(this.state.paused) {
			this.clearPlayField();
			this.drawAll();
			this.drawMessage('Paused');
		}
	}

	// Drawing Functions ////

	fitToViewport(context, percentOfViewport = 100) {
		let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			
		let scaleX = w / this.state.fieldWidth;
		let scaleY = h / this.state.fieldHeight;
		let scale = Math.min(scaleX, scaleY) * (percentOfViewport / 100.0);

		// determine new canvas dimensions:
		let newCanvasWidth = Math.floor(this.state.fieldWidth * scale);
		let newCanvasHeight = Math.floor(this.state.fieldHeight * scale);
		
		// determine offsets for centering the playfield:
		let offsetTop = 0.5 * (newCanvasHeight - this.state.fieldHeight * scale);
		let offsetLeft = 0.5 * (newCanvasWidth - this.state.fieldWidth * scale);

		this.setState({
			offsetLeft: offsetLeft,
			offsetTop: offsetTop,
			canvasWidth: newCanvasWidth,	// width of canvas
			canvasHeight: newCanvasHeight,	// height of canvas
			scale: scale,				// scale of game playfield (canvas pixel : game pixel ratio)
		}, () => {
			context.setTransform(1, 0, 0, 1, 0, 0); // reset whatever previous transforms were in-place
			context.scale(scale, scale);	// set scale	
			context.translate(offsetLeft, offsetTop); // position playfield in the center of canvas
		});
	}

	clearPlayField(color="#000000") {
		const ctx = this.state.context;
		ctx.save();
		ctx.globalAlpha = 0.3;
		ctx.fillStyle =color;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillRect(0,0,this.state.canvasWidth,this.state.canvasHeight);
		ctx.restore();
	}
	
	drawAll() {
		this.dragonballCollection.drawNext();
		this.laserBase.drawNext();
		this.weevilCollection.drawNext();
		this.spitballCollection.drawNext();
		this.dragonfly.drawNext();
		this.explosionCollection.drawNext();
		this.drawScores();
	}

	drawStartScreen() {
		const ctx = this.state.context;
		ctx.save();
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#ffffff";
		ctx.font = "48px sans-serif";
		const text = "Press Any Key to Start";
		let textWidth = ctx.measureText(text).width;
		ctx.fillText(text,(this.state.fieldWidth-textWidth)/2, this.state.fieldHeight / 2);
		ctx.restore();
	}

	drawMessage(message) {
		const ctx = this.state.context;
		ctx.save();
		ctx.globalAlpha = 1;
		ctx.fillStyle = "#ffffff";
		ctx.font = "48px sans-serif";
		let textWidth = ctx.measureText(message).width;
		ctx.fillText(message,(this.state.fieldWidth-textWidth)/2, this.state.fieldHeight / 2);
		ctx.restore();
	}
	
	drawScores() {
		const ctx = this.state.context;
		ctx.save();
		ctx.globalAlpha = 0.8;
		ctx.fillStyle = "#ffffff";
		ctx.font = "18px Lucida Console";
		let s='SCORE: ' + this.state.score;
		let hs='HI-SCORE: ' + this.state.highScore;
		let b='BASES: ' + this.state.bases;
		let l='LEVEL: ' + this.state.level;
		let hsWidth = ctx.measureText(hs).width;
		let lWidth = ctx.measureText(l).width;
		ctx.fillText(s, 10, 20);
		ctx.fillText(hs, this.state.fieldWidth - 10 - hsWidth, 20);
		ctx.fillText(b, 10, this.state.fieldHeight - 10);
		ctx.fillText(l, this.state.fieldWidth - 10 - lWidth,  this.state.fieldHeight - 10);
		ctx.restore();
	}

	// Game state manipulation ////

	startGame() {
		this.setState({
			bases: 3,
			score: 0,
			level: 1,
			inGame: true,
			dragonballLaunchCountdown: 0,
			laserNTemp: 0,
			laserETemp: 0,
			laserSTemp: 0,
			laserWTemp: 0,
		});
		
		this.clearEnemies();
		this.dragonfly.hidden = true;

		this.loadLevel(this.state.level);
	}

	endGame() {

		// wait 100ms, display 'Game Over', then wait 3s and then allow new games ...
		setTimeout(()=>{
			this.setState({
				inGame: false,
				readyToPlay: false,
			});

			this.clearPlayField();
			this.drawMessage('Game Over');
			
			setTimeout(()=>{this.setState({readyToPlay: true})},3000);
		},100);
	}

	loadLevel(levelNumber) {
		levelNumber = levelNumber <=0 ? 0 : levelNumber - 1; // note: index 0 == level 1
		levelNumber = levelNumber > levels.length - 1 ? levels.length - 1 : levelNumber;
		this.setState(levels[levelNumber], 
			() => {
				this.dragonfly.selectFlightPathByName(this.state.dragonflyFlightPath);
				this.weevilCollection.setWeevilMargin(this.state.weevilMargin);
				this.spitballCollection.setWeevilMargin(this.state.weevilMargin);
			}
		);
	}

	togglePause() {
		this.setState({paused: !this.state.paused});
		if(this.state.paused)
			this.drawMessage('Paused');
	}

	clearEnemies() {
		this.weevilCollection.weevils = [];
		this.spitballCollection.spitballs = [];
		this.explosionCollection.clear();
		this.dragonballCollection.clear();
	}

	bumpScore(amount) {
		this.setState({score: this.state.score + amount});
			if(this.state.score >= this.state.highScore)
				this.setState({highScore: this.state.score});
	}

	// update functions ////
	
	launchNewSpitballs() {
		// conditionally launch new spitballs: 
		if(this.spitballCollection.spitballs.length < this.state.maxSpitballs) {
			const weevilPositions = ['N','E','S','W'];
			let j = this.state.nextWeevilToSpit; // for round-robin;
			for(let i=0; i<weevilPositions.length; i++) {
				let direction = weevilPositions[j];
				this.setState({nextWeevilToSpit: j >= weevilPositions.length ? 0 : j+1}); // round-robin mechanism 
				let weevil=this.weevilCollection.weevils.filter(b => b.direction === direction)[0]; // IE11 compatibility: x.filter(f)[0] subsituted for x.find(f)
				if(weevil !== undefined && weevil.ready) {
					this.spitballCollection.launchSpitball(direction);
				}
			}
		}
	}

	launchNewDragonballs() {
		// conditionally launch new dragonballs:
		if(!this.dragonfly.hidden && 
			this.state.dragonballLaunchCountdown <= 0 &&
			this.dragonballCollection.dragonballs.length < this.state.maxDragonballs) {
			
			let x0, y0, r;
			({x: x0, y: y0, r} = this.dragonfly.getPosition());
		
			let dx = Math.cos(-r-HALFPI);
			let dy = Math.sin(-r-HALFPI);
			let x1 = x0 + dx;
			let y1 = y0 + dy;

			let centerX = this.state.fieldWidth / 2;
			let centerY = this.state.fieldHeight / 2;

		  if(isHeadedTowards(x0,y0,x1,y1,centerX,centerY)) { // dragonfly is facing towards base

				let discriminant = testLineCircleIntersection(x0,y0,x1,y1,centerX,centerY,this.state.dragonflyNoShootRadius);
				if(discriminant < 0) { // oustide the No-Shoot Radius; ok to shoot ...
						let vx = 2 * Math.cos(-r-HALFPI);
						let vy = 2 * Math.sin(-r-HALFPI);
						this.dragonballCollection.dragonballs.push({x: x0, y: y0, vx: vx, vy: vy});
						this.setState({dragonballLaunchCountdown: this.state.dragonballLaunchWait});
				}

				/*
				// for debugging dragonfly angle:
				let ctx = this.state.context;
				ctx.save();
				ctx.strokeStyle = (discriminant >= 0) ? "#ff0000" : "#00ff00";	
				ctx.beginPath();
				ctx.arc(centerX, centerY, this.state.dragonflyNoShootRadius, 0, TWOPI);
				ctx.moveTo(x0, y0);
				ctx.lineTo(x0 + 600 * dx, y0 + 600 * dy);
				ctx.stroke();
				ctx.restore();
				//
				*/
			}
		}	else {
			this.setState({dragonballLaunchCountdown: Math.max(0,this.state.dragonballLaunchCountdown -1)}); // countdown
		}
	}

	fireLaser(targetDirection) {
	 
		if(this.state.paused)
			return;

		this.soundCollection.fire(targetDirection);

		switch(targetDirection) {
			case 'N':
				if(this.state.laserNTemp !== 0)
					return;
				this.setState({laserNTemp: this.state.laserCooldown});
				break;
			case 'S':
				 if(this.state.laserSTemp !== 0)
					return;
				this.setState({laserSTemp: this.state.laserCooldown});
				break;
			case 'W':
				if(this.state.laserWTemp !== 0)
					return;
				this.setState({laserWTemp: this.state.laserCooldown});
				break;
			case 'E':
				if(this.state.laserETemp !== 0)
					return;
				this.setState({laserETemp: this.state.laserCooldown});
				break;
			default:
		}

		let laserHitPosition =0;
		let spitballHit = false;
		let spitballHitIndex = 0;
		
		if(this.dragonballCollection.dragonballs.length !== 0) {
			for(let i=this.dragonballCollection.dragonballs.length-1; i>=0; i--) {
				let dragonball = this.dragonballCollection.dragonballs[i];
				if(this.dragonballCollection.isHit(i, targetDirection)) {
						this.soundCollection.playExplosion2();
						this.explosionCollection.add(dragonball.x, dragonball.y, 3.0);
						this.dragonballCollection.dragonballs.splice(i,1);
						this.bumpScore(400);
				}
			} 
		}

		if(this.spitballCollection.spitballs.length !== 0) { // check for spitball collisions
			for(let i=0; i<this.spitballCollection.spitballs.length; i++) {
				if(this.spitballCollection.spitballs[i].ready && this.spitballCollection.spitballs[i].direction === targetDirection) {
					let spitballPos = this.spitballCollection.spitballs[i].position - 10;
					if(spitballPos > laserHitPosition){ // record the closest (most advanced) spitball
						laserHitPosition = spitballPos + this.spitballCollection.weevilMargin;
						spitballHitIndex = i;
						spitballHit = true;
					}
				}
			}
		}

		if(spitballHit) {
			this.spitballCollection.spitballs.splice(spitballHitIndex,1);
			this.laserBase.drawLaserBeam(targetDirection, laserHitPosition+this.spitballCollection.spitballLength);
			this.bumpScore(200);
			return;
		}

		if(this.weevilCollection.weevils.length !== 0) { // check for weevil collisions
			for(let i=this.weevilCollection.weevils.length-1; i>=0; i--) {
				let weevilOfInterest = this.weevilCollection.weevils[i];
				if(weevilOfInterest.ready && weevilOfInterest.direction === targetDirection) {
					this.laserBase.drawLaserBeam(targetDirection, this.weevilCollection.weevilRadius + this.weevilCollection.weevilMargin);
					this.weevilCollection.weevils.splice(i,1);
					this.bumpScore(750);
					let weevilCoordinates = this.weevilCollection.getWeevilPosition(targetDirection);
					this.soundCollection.playExplosion1();
					this.explosionCollection.add(weevilCoordinates.x ,weevilCoordinates.y, 1.2);
					this.spitballCollection.cancelSpitballs(targetDirection);
					if(this.weevilCollection.allDead()){
						this.setState({wavesCleared: this.state.wavesCleared + 1});
						// console.log('waves cleared:', this.state.wavesCleared);
						if(	this.state.wavesCleared >= 5){
							this.setState({wavesCleared: 0});
							this.dragonfly.hidden = false;
						}
					}
					return;
				}
			}
		}

		if(this.dragonfly.isHit(targetDirection)) {
			// console.log('dragonfly hit!');
			this.dragonfly.hidden = true;
			let dragonflyCoordinates = this.dragonfly.getPosition();
			this.explosionCollection.add(dragonflyCoordinates.x, dragonflyCoordinates.y, 2.0);
			this.soundCollection.playExplosion3();
			this.setState({level: this.state.level + 1, wavesCleared: 0});
			this.loadLevel(this.state.level);
			this.bumpScore(2000);
		}

		this.laserBase.drawLaserBeam(targetDirection,0); // miss
	}

	coolLasers() {
		this.setState({
			laserNTemp: Math.max(0,this.state.laserNTemp-1),
			laserETemp: Math.max(0,this.state.laserETemp-1),
			laserSTemp: Math.max(0,this.state.laserSTemp-1),
			laserWTemp: Math.max(0,this.state.laserWTemp-1),
		});
	}

	// the render() function ////

	render() {
		return (
			<div className="App">
				<canvas ref="canvas" width={this.state.canvasWidth} height={this.state.canvasHeight}/>
			</div>
		);
	}
}

// props

App.propTypes = {framesPerSecond: React.PropTypes.number};
App.defaultProps = {framesPerSecond: 60};

export default App;