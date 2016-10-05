import laserSndData from '../sounds/laser1.wav'; // laserSndData is a data URL (by virtue of Webpack's URL loader which will load wav Data <10k size as data URLs)
import explosionSndData from '../sounds/explosion1.mp3';
export default class SoundCollection {
	constructor() {
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
		}
	}

	_loadSounds() {
		this._loadSound(laserSndData, 'laserSnd');
		this._loadSound(explosionSndData, 'explosionSnd');
	}

	_loadSound(url, sndName) {
		let request = new XMLHttpRequest();
  	request.open('GET', url, true);
  	request.responseType = 'arraybuffer'; 	// audio buffer needs to be in arraybuffer format for use with Sound API

		request.onload = () => {
			this.audioContext.decodeAudioData(request.response, (buffer) => {
				this.buffers[sndName] = buffer;
			}, () => console.log('could not load ', sndName));
		}
  	request.send();
	}

	_playSound(sndName) {
		
		if(!this.soundOK) return;
		let buffer = this.buffers[sndName];
		if (buffer === undefined) return;
		
		let source = this.audioContext.createBufferSource();
		source.buffer = buffer;
		source.connect(this.audioContext.destination);
		source.start(0);
	}

	fire(direction) {
		this._playSound('laserSnd');
	}

	playExplosion() {
		this._playSound('explosionSnd');
	}
}

