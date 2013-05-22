"use strict";
//Input controls
var keyStatus = { thrust: false, brake: false, fire: false, lstrafe: false, rstrafe: false, warp: false, comms: false, enter: false, config: false, menu: false };

// Audio API
var analyser;
var freqByteData;

//load the canvas
var canvas = document.getElementById('scene');

// Canvas Compatibility
if (canvas.getContext){  
  var ctx = canvas.getContext('2d');  
} else {  
  // canvas-unsupported code here  
	console.log('Sorry, but your browser doesn\'t support Canvas.');
	exit;
}
//give it mouse coords
canvas.xy = canvas.leftTopScreen();
canvas.mousePos = {	x:0,y:0}

// set event listners
window.addEventListener('load', init, false);
// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
//catch mouse pos
canvas.addEventListener ("mousemove", function (event) {
	var x = event.clientX;
	var y = event.clientY;
	this.mousePos.x = (x - this.xy[0])-(canvas.width/2);
	this.mousePos.y = (y - this.xy[1])-(canvas.height/2);
});

//START FUNCTIONS---------------------------------------------------------------------------------------------------------------
function init() {
	resizeCanvas();
	var game = gameEngine();
	var draw = graphicsEngine();
	game.bgObjects = spawnStarScape();
	game.enviroObjects = spawnSystems();
	game.interactObjects = spawnInteract();
	game.missions.push(missionDestroyComet());
	game.missions.push(missionDestroyShips());
	game.missions.push(missionDeliverPackage(game));
	
	setupWebAudio();
	goMusic();
	inputListner();
	
	// the function making it all happen
	setInterval(function() {
		if (game.status === 0){
			game.showMenu();
		} else if (game.status === 1){
			game.runGame();
		} else if (game.status === 2){
			game.showCommMenu();
		} else if (game.status === 3){
			game.showRewardMenu();
		} else if (game.status === 4){
			game.showShopMenu();
		} else if (game.status === 5){
			game.showEngineMenu();
		} else if (game.status === 6){
			game.showPauseMenu();
		}
	}, 55);
}

//START BASE FUNCTIONS-------------------------------------------------------------------------------------------------------------
function inputListner(){
	//for movement
	$(document).keydown(function(e) {
		if (e.keyCode === 65) {
			e.preventDefault();
			keyStatus.thrust = true;
		} else if (e.keyCode === 90) {
			e.preventDefault();
			keyStatus.brake = true;
		} else if (e.keyCode === 17) {
			e.preventDefault();
			keyStatus.fire = true;
		}else if (e.keyCode === 37) {
			e.preventDefault();
			keyStatus.lstrafe = true;
		} else if (e.keyCode === 39) {
			e.preventDefault();
			keyStatus.rstrafe = true;
		} else if (e.keyCode === 18) {
			e.preventDefault();
			keyStatus.warp = true;
		} else if (e.keyCode === 67) {
			e.preventDefault();
			keyStatus.comms = true;
		} else if (e.keyCode === 13) {
			e.preventDefault();
			keyStatus.enter = true;
		} else if (e.keyCode === 99) {
			e.preventDefault();
			keyStatus.config = true;
		} else if (e.keyCode === 199) {
			e.preventDefault();
			keyStatus.menu = true;
		}
	});

	$(document).keyup(function(e) {
		if (e.keyCode === 65) {
			e.preventDefault();
			keyStatus.thrust = false;
		} else if (e.keyCode === 90) {
			e.preventDefault();
			keyStatus.brake = false;
		} else if (e.keyCode === 17) {
			e.preventDefault();
			keyStatus.fire = false;
		} else if (e.keyCode === 37) {
			e.preventDefault();
			keyStatus.lstrafe = false;
		} else if (e.keyCode === 39) {
			e.preventDefault();
			keyStatus.rstrafe = false;
		} else if (e.keyCode === 18) {
			e.preventDefault();
			keyStatus.warp = false;
		} else if (e.keyCode === 67) {
			e.preventDefault();
			keyStatus.comms = false;
		} else if (e.keyCode === 13) {
			e.preventDefault();
			keyStatus.enter = false;
		} else if (e.keyCode === 99) {
			e.preventDefault();
			keyStatus.menu = false;
		} else if (e.keyCode === 119) {
			e.preventDefault();
			keyStatus.menu = false;
		}
	});
    $(document).mousedown(function(e) {
		e.preventDefault();
		switch (event.which) {
			case 1:
				keyStatus.fire = true;
				break;
			case 2:
				keyStatus.warp = true;
				keyStatus.thrust = true;
				break;
			case 3:
				e.preventDefault();
				keyStatus.thrust = true;
		}
	});
    $(document).mouseup(function(e) {
		switch (event.which) {
			case 1:
				e.preventDefault();
				keyStatus.fire = false;
				break;
			case 2:
				e.preventDefault();
				keyStatus.warp = false;
				keyStatus.thrust = false;
				break;
			case 3:
				e.preventDefault();
				keyStatus.thrust = false;
		}
	});
	window.oncontextmenu = function(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};
}

// Monitor the audio frequencies
function goMusic() {
	// Setup the next frame of the drawing
	webkitRequestAnimationFrame(goMusic);
   // Create a new array that we can copy the frequency data into
	freqByteData = new Uint8Array(analyser.frequencyBinCount);
	// Copy the frequency data into our new array
	analyser.getByteFrequencyData(freqByteData);
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

function resizeCanvas() {canvas.width = window.innerWidth;canvas.height = window.innerHeight-10;}