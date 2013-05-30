/*
 * Created by Cameron Adams on 18th September 2012
 * More info here: http://themaninblue.com/writing/perspective/2012/09/18/
 *
 */

var analyser, canvas, canvasContext;

window.addEventListener('load', init, false);

function init() {
	setupWebAudio();
	setupDrawingCanvas();
	draw();
}


// Wire up the <audio> element with the Web Audio analyser (currently Webkit only)
function setupWebAudio() {
	// Get our <audio> element
	var audio = document.getElementById('music');
	// Create a new audio context (that allows us to do all the Web Audio stuff)
	var audioContext = new webkitAudioContext();
	// Create a new analyser
	analyser = audioContext.createAnalyser();
	// Create a new audio source from the <audio> element
	var source = audioContext.createMediaElementSource(audio);
	// Connect up the output from the audio source to the input of the analyser
	source.connect(analyser);
	// Connect up the audio output of the analyser to the audioContext destination i.e. the speakers (The analyser takes the output of the <audio> element and swallows it. If we want to hear the sound of the <audio> element then we need to re-route the analyser's output to the speakers)
	analyser.connect(audioContext.destination);

	// Get the <audio> element started	
	audio.play();
}

// Draw the audio frequencies to screen
function draw() {
	// Setup the next frame of the drawing
  webkitRequestAnimationFrame(draw);
  
  // Create a new array that we can copy the frequency data into
	var freqByteData = new Uint8Array(analyser.frequencyBinCount);
	// Copy the frequency data into our new array
	analyser.getByteFrequencyData(freqByteData);

	// Clear the drawing display
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	var j=0;
	// For each "bucket" in the frequency data, draw a line corresponding to its magnitude
	for (var i = 0; i < freqByteData.length; i++) {
		canvasContext.fillRect(i, canvas.height - freqByteData[i], 1, canvas.height);
		
		if (j == 20){
			canvasContext.fillText(i, i, canvas.height); 
			canvasContext.fillText(i, i, 10); 
			j=0;
		}
		j += 1;
	}
}

// Basic setup for the canvas element, so we can draw something on screen
function setupDrawingCanvas() {
	canvas = document.createElement('canvas');
	// 1024 is the number of samples that's available in the frequency data
	canvas.width = 1024;
	// 255 is the maximum magnitude of a value in the frequency data
	canvas.height = 255;
	document.body.appendChild(canvas);
	canvasContext = canvas.getContext('2d');
	canvasContext.fillStyle = '#ffffff';
}