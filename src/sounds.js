import laserSndData from '../sounds/laser1.wav'; // laserSndData is a data URL (by virtue of Webpack's URL loader which will load wav Data <10k size as data URLs)
import explosion1SndData from '../sounds/explosion1.mp3';
import explosion2SndData from '../sounds/explosion2.mp3';
import explosion3SndData from '../sounds/explosion3.mp3';
import reverbData from '../sounds/reverb.mp3';

function 	dBtoVoltageGain(dB) {
	return Math.pow(10, dB / 20);
}

export default class SoundCollection {
	constructor() {

		this.useReverb = true;
		this.masterReverbLevel = -15; // dB
		
		this.buffers = {};
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext; // Fix up prefixing
			this.audioContext = new AudioContext();
			this.soundOK = true;
		}
		catch(err) {
			console.log('error: unable to load sound system: ', err);
			this.soundOK = false;
			return;
		}
		if(this.soundOK) {
			this._loadSounds();
			if(this.useReverb) {
				this._initReverb();
			}
		}
	}

	_loadSounds() {
		this._loadSound(laserSndData, 'laserSnd');
		this._loadSound(explosion1SndData, 'explosion1Snd');
		this._loadSound(explosion2SndData, 'explosion2Snd');
		this._loadSound(explosion3SndData, 'explosion3Snd');
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
			}, () => console.log('could not load ', sndName));
		}
  	request.send();
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
	
}

