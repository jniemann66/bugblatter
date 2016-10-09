import laserSndData from '../sounds/laser2.wav'; // laserSndData is a data URL (by virtue of Webpack's URL loader which will load wav Data <10k size as data URLs)
import explosion1SndData from '../sounds/explosion1.mp3';
import explosion2SndData from '../sounds/explosion2.mp3';
import explosion3SndData from '../sounds/explosion3.mp3';
import reverbData from '../sounds/reverb.mp3';
import basedeathData from '../sounds/BaseDeath-mono.mp3';

function 	dBtoVoltageGain(dB) {
	return Math.pow(10, dB / 20);
}

export default class SoundCollection {
	constructor() {
		this.useReverb = true;
		this.masterReverbLevel = -15; // dB
		this.soundOK = false;
		this.buffers = {};
		this.activated = false;

		try {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			this.soundOK = true;	
		}
		catch(err) {
			alert("NOTE: Unfortunately, Your Browser doesn't support the Web Audio API, so there won't be any sound !");
			this.soundOK = false;
			return;
		}
	}

	activateSound() {

		if(this.activated)
			return;
		
		this.activated = true;

		if(!this.soundOK)
			return;

			if(this.audioContext.state === 'suspended') {
				this.audioContext.resume().then( () => {

					// play a silent "sound" to unloack iOS sound system (needs to be done in a touchend event ...)
					let fuApple = this.audioContext.createBuffer(1,1,44100); // 1 channel, 1 sample, 44.1khz s/r
					let fuAppleSrc = this.audioContext.createBufferSource();
					fuAppleSrc.buffer = fuApple;
					fuAppleSrc.connect(this.audioContext.destination);
					fuAppleSrc.start(0);

/*				
					// load and play a sound to unlock iOS sound system (needs to be done in a touchend event ...)
					this._loadSound(explosion1SndData, 'explosion1Snd', () => {
							let source = this.audioContext.createBufferSource();
							source.buffer = this.buffers.explosion1Snd;
							source.connect(this.audioContext.destination);
							source.start(0);
					});
*/
					// load the sounds
					this._loadSounds();
					if(this.useReverb) 
						this._initReverb();

				});
		} else {
			this._loadSounds();
			if(this.useReverb) 
				this._initReverb();
		}
	}

	_loadSounds() {
		this._loadSound(laserSndData, 'laserSnd');
		this._loadSound(explosion1SndData, 'explosion1Snd');
		this._loadSound(explosion2SndData, 'explosion2Snd');
		this._loadSound(explosion3SndData, 'explosion3Snd');
		this._loadSound(basedeathData, 'basedeathSnd');
	}

	_loadSound(url, sndName, callback) {
		let request = new XMLHttpRequest();
  	request.open('GET', url, true);
  	request.responseType = 'arraybuffer'; 	// audio buffer needs to be in arraybuffer format for use with Sound API

		request.onload = () => {
			this.audioContext.decodeAudioData(request.response, (buffer) => {
				this.buffers[sndName] = buffer;
				if(callback)
					callback();
			}, (err) => {
				console.log('could not decode ', sndName + ' : ' + err);
			});
		}
  	request.send();
	}

	_loadAndPlaySound(url, sndName) {
		this._loadSound(url, sndName, () => {
			this._playSound(sndName);
		});
	}

	_initReverb() {
		this._loadSound(reverbData, 'reverbIR', () => {
			this.convolver = this.audioContext.createConvolver();
			this.convolver.buffer = this.buffers.reverbIR;
			this.reverbGainStage = this.audioContext.createGain();
			this.reverbGainStage.gain.value = dBtoVoltageGain(this.masterReverbLevel);
			this.reverbGainStage.connect(this.audioContext.destination);
			this.convolver.connect(this.reverbGainStage);
		});
	}

	_playSound(sndName) {
		if(!this.soundOK) return;
		let buffer = this.buffers[sndName];
		if (buffer === undefined) return;
		
		let source = this.audioContext.createBufferSource();
		source.buffer = buffer;
		source.connect(this.audioContext.destination); // dry
		
		if(this.useReverb) {
			source.connect(this.convolver);	// wet
		}
		
		source.start(0);
	}

	// PUBLIC INTERFACE:

	setMasterReverbLevel(dB) {
		if(!this.useReverb)
			return;
		this.masterReverbLevel = dB;
		this.reverbGainStage.gain.value = dBtoVoltageGain(dB);
	}

	fire(direction) {
		this._playSound('laserSnd');
	}

	playExplosion1() {
			this._playSound('explosion1Snd');
	}

	playExplosion2() {
			this._playSound('explosion2Snd');
	}

	playExplosion3() {
			this._playSound('explosion3Snd');
	}
	
	playBasedeath() {
			this._playSound('basedeathSnd');
	}
}

