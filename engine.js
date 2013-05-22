function gameEngine(){
	var game = [ ];
	game.status = 0;
	game.backgroundObjects = [ ];
	game.environmentObjects = [ ];
	game.interactObjects = [ ];
	game.activeObjects = [ ];
	game.damageObjects = [ ];
	game.enemyObjects = [ ];
	game.messageObjects = [ ];
	game.missionObjects = [ ];
	game.missions = [ ];
	game.player = {lives: 3, credit: 0, mission: {}, comm_channel: 0};
	game.player.ship = {
		xpos: 0, ypos: 0, zpos: 0, heading: 90,	speed: 0, thrust: 2.9, friction: .99, warp: 250, comm_channel: "", type: "player",
		energy_charge: 1000, energy_recharge: .8, energy_max: 1000, 
		hull: 1000, hull_max: 1000,	hull_repair: .4,
		wpn_speed: 500, wpn_power: 200, wpn_range: 5, wpn_cooldown: 5, wpn_cost: 15, wpn_charge: 100, wpn_recharge: 1.8, wpn_max: 200, wpn_ticker: 100, wpn_offline: false
	};
	game.player.camera = { x: 0, y: -500, z: 0, rotation: 0, upAngle: 0, focalLength: 800 };
	game.colorPallet = [ 'red', 'green', 'pink', 'yellow', 'cyan', 'white', 'orange', 'blue', 'maroon', 'lime' ];
	game.colorPalletWarm = [ '#fffc1f', '#fff71f', '#fff21f', '#ffe71f', '#ffe21f', '#ffdd1f', '#ffd21f', '#ffcd1f', '#ffbd1f', '#ffb81f', '#ffad1f', '#ffa31f', '#ff9d1f', '#ff8e1f', '#ff831f', '#ff6e1f', '#ff5e1f', '#ff541f', '#ff491f', '#ff391f' ];
	game.colorPalletCold = [ '#bee8f2', '#9cd9f0', '#7acfee', '#71cef1', '#5bcaf3', '#41c6f7', '#41c2f7', '#41bdf7', '#41b5f7', '#41b0f7', '#41acf7', '#41a4f7', '#419ff7', '#4193f7', '#418af7', '#4181f7', '#4179f7', '#416cf7', '#3160f7', '#2054fe' ];

	game.cameraCalc = function() {	
		this.player.camera.rotation = this.player.ship.heading;
		this.player.camera.x = this.player.ship.xpos -(Math.sin(this.player.camera.rotation)*(2*this.player.ship.speed+100));
		this.player.camera.z = this.player.ship.zpos -(Math.cos(this.player.camera.rotation)*(2*this.player.ship.speed+100));
		this.player.camera.y = -(canvas.height/2)
		// use the mouse to rotate the camera left and right
		// use the mouse to rotate the camera up and down
		this.player.camera.upAngle += canvas.mousePos.y/6000;
		// kep the vertical angle between 0 (straight ahead)
		// and Math.PI/4  or  down 45 deg
		if (this.player.camera.upAngle > Math.PI/4) (this.player.camera.upAngle = Math.PI/4);
		if (this.player.camera.upAngle < 0) this.player.camera.upAngle = 0;
		//set the frame for 3d perspective on sprites
	}
	
	game.plotPath = function(origx, origy, destx, desty, loop) {
		var pathArray = new Array();
		var coordArray = new Array();
		coordArray.x = origx;
		coordArray.y = 0;
		coordArray.z = origy;
		coordArray.end = 0;
		pathArray.push(coordArray);
		coordArray = new Array();
		coordArray.x = destx;
		coordArray.y = 0;
		coordArray.z = desty;
		if (loop) {coordArray.end = 0;} else {coordArray.end = 1;}
		pathArray.push(coordArray);
		return pathArray;
	}

	game.showMenu = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas 
		this.player.camera.upAngle += .001;
		drawMainMenu(canvas.width, canvas.height, ctx);
	
		// background objects
		for (var i=0; i<this.bgObjects.length; i++){
			this.bgObjects[i].process(freqByteData, this.colorPallet, this.player.camera);
		}
		if (keyStatus.enter){
			this.status = 1;
		}
	}
	game.showCommMenu = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas 
		this.player.camera.upAngle += .001;
		drawCommMenu(canvas.width, canvas.height, this.interactObjects[this.player.comm_channel], this.missions[this.player.mission.id], ctx);

		if (keyStatus.enter){
			this.missions[this.player.mission.id].StartMission(this, this.missions[this.player.mission.id])
			this.status = 1;
		}
		if (keyStatus.comms){
			this.player.comm_channel = -1;
			this.player.mission.id = -1;
			this.status = 1;
			keyStatus.comms = false;
		}
	}
	game.showRewardMenu = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas 
		this.player.camera.upAngle += .001;
		
		drawRewardMenu(canvas.width, canvas.height, this.interactObjects[this.player.comm_channel], this.missions[this.player.mission.id], ctx);

		if (keyStatus.enter){
			this.player.mission.location = -1;
			this.player.comm_channel = -1;
			this.player.credit += this.missions[this.player.mission.id].reward;
			this.player.mission.id = -1;
			this.status = 1;
		}
	}

	game.runGame = function(){
		ctx.clearRect(0,0,canvas.width,canvas.height); // clear canvas 
		game.cameraCalc(game.player.camera);
		// background objects
		for (var i=0; i<this.bgObjects.length; i++){
			this.bgObjects[i].process(freqByteData, this.colorPallet, this.player.camera);
		}
		// environment objects
		this.enviroObjects.sort(function(a, b) {
			var valueA, valueB;
			valueA = Math.round(a['_z']); // Where 1 is your index, from your example
			valueB = Math.round(b['_z']);
			if (valueA < valueB) {
				return 1;
			}
			else if (valueA > valueB) {
				return -1;
			}
			return 0;
		});
	
		//active objects
		for (var i=0; i<this.activeObjects.length; i++){
			if (this.activeObjects[i].life <= 0) {
				this.activeObjects.splice(i, 1); 
				
			} else {
				this.activeObjects[i].process();
			}
		}
		
		//enemy objects
		for (var i=0; i<this.enemyObjects.length; i++){
			if (this.enemyObjects[i].life <= 0) {
				this.enemyObjects.splice(i, 1); 
			} else {
				this.enemyObjects[i].process(this.damageObjects, game.player.ship);
			}
		}
	
		for (var i=0; i<this.damageObjects.length; i++){
			if (this.damageObjects[i].life <= 0) {
				if(this.damageObjects[i].mission == true){
					console.log("check for mission failure")
					
				}
				this.damageObjects.splice(i, 1); 
			} else {
				this.damageObjects[i].process(this.activeObjects, this.enemyObjects, this.damageObjects, game.player.ship, game.player.camera);
				
				this.damageObjects[i].life -= this.damageObjects[i].decay;
			}
		}
		
		var screenObjects = this.enviroObjects.concat(
									this.activeObjects, 
									this.damageObjects, 
									this.missionObjects, 
									this.interactObjects,
									this.messageObjects,
									this.enemyObjects
							);
		
		screenObjects.sort(function(a, b) {
			var valueA, valueB;
			valueA = Math.round(a['_z']);
			valueB = Math.round(b['_z']);
			if (valueA < valueB) {
				return 1;
			}
			else if (valueA > valueB) {
				return -1;
			}
			return 0;
		});
		
		for (var i=0; i<screenObjects.length; i++){
			this.displayObject(screenObjects[i], freqByteData, this.colorPalletWarm, this.colorPalletCold, this.colorPallet);
		}
			
		if (game.player.ship.hull <= 0) { 
				deathScene((canvas.width/2)-150, (canvas.height/2), ctx);
		} else {
			this.runShip();
		}
	
		HUD(this.player.ship, this.player.credit, ctx);
	}
	game.runShip = function(){
		game.player.ship.heading += canvas.mousePos.x/6000;
		
		//Charge ship weapons
		if (game.player.ship.wpn_charge < game.player.ship.wpn_max && game.player.ship.energy_charge > game.player.ship.wpn_recharge) {
			game.player.ship.wpn_charge += game.player.ship.wpn_recharge;
			game.player.ship.energy_charge -= game.player.ship.wpn_recharge;
			game.player.ship.wpn_ticker += 1;
		}
		
		//Repair ship hull
		if (game.player.ship.hull < game.player.ship.hull_max && game.player.ship.hull_repair > game.player.ship.wpn_recharge) {
			game.player.ship.hull += game.player.ship.hull_repair;
		}
	
		//Charge ship energy
		if (game.player.ship.energy_charge < game.player.ship.energy_max) {
			game.player.ship.energy_charge += game.player.ship.energy_recharge;
		}
	
		if (keyStatus.fire){
			if (game.player.ship.wpn_charge >= game.player.ship.wpn_cost && game.player.ship.wpn_ticker >= game.player.ship.wpn_cooldown) {
				game.player.ship.wpn_charge -= game.player.ship.wpn_cost;
				game.player.ship.wpn_ticker = 0;
				this.damageObjects.push(spawnPlayerObject("missile1", game.player.ship.xpos + Math.sin(game.player.ship.heading)*10, game.player.ship.ypos, game.player.ship.zpos + (Math.cos(game.player.ship.heading)*10),game.player.ship.heading,game.player.ship));
				//play sound lazer
			}
		}
		var distance;
		var inRange = false;
		for (var i=0; i<this.interactObjects.length; i++){
			distance = Math.sqrt( Math.pow( this.interactObjects[i].xpos - this.player.camera.x, 2 ) + Math.pow( this.interactObjects[i].zpos - this.player.camera.z, 2 ) );
			
			if (distance < 1000){
				inRange = true;
				this.interactObjects[i].proximity = 2;
				drawShipDamage(canvas.width,canvas.height, ctx);
				game.player.ship.hull	-= game.player.ship.speed;
			} else if (distance < 1500){
				inRange = true;
				this.interactObjects[i].proximity = 2;
				drawText("red", "Alert, "+this.interactObjects[i].name+" collision imminent", 10, 160, ctx);
			} else if (distance < 2500){
				inRange = true;
				this.interactObjects[i].proximity = 2;
				drawText("yellow", "Warning, "+this.interactObjects[i].name+" proximity too close", 10, 160, ctx);
			} else if (distance < 10000){
				inRange = true;
				this.interactObjects[i].proximity = 1;
				drawText("white", this.interactObjects[i].name+" in communication range", 10, 160, ctx);
		
				if (keyStatus.comms){
					if (game.player.mission.id > -1 && game.player.mission.objectCount == 0 && this.interactObjects[i] == this.interactObjects[game.player.mission.location]){
						game.status = 3;
					} else if (game.player.mission.id > -1) {
						drawText("red", "You must complete your current mission ("+game.player.mission.objectCount+" objectives)", 10, 160, ctx);
					} else {
						game.player.comm_channel = i;
						game.player.mission.id = Math.floor(Math.random()*game.missions.length);
						game.status = 2;
						keyStatus.comms = false;
						break;
					}
				}
			}
		}
		if (!inRange){
			drawText("white", "Out of communication range", 10, 160, ctx)
		}
		
		if (game.player.mission.id > -1){
			if(game.player.mission.objectCount > 0 && game.player.mission.status < 2){
				drawText("white", "Mission in progress", 10, 200, ctx);
				drawText("white", "Items remaining: "+game.player.mission.objectCount, 10, 240, ctx);
				for(var i=0; i<this.missionObjects.length; i++){
					if (this.missionObjects[i].type == "damage"){
						if (typeof game.damageObjects[this.missionObjects[i].id-1] !== "undefined"){
							drawText("white", "Objective: "+
								this.missionObjects[i].name
								+" "+Math.round(game.damageObjects[this.missionObjects[i].id-1].xpos/1000)
								+","+Math.round(game.damageObjects[this.missionObjects[i].id-1].zpos/1000)
								, 10, 260+(i*20), ctx);
							
						}else{
							//this.missionObjects.splice(i, 1); 
							//game.missions[game.player.mission.id].objectCount -= 1;
						}
				
					} else if (this.missionObjects[i].type == "enemy"){
						if (typeof game.enemyObjects[this.missionObjects[i].id-1] !== "undefined"){
							drawText("white", "Objective: "+
								this.missionObjects[i].name
								+" "+Math.round(game.enemyObjects[this.missionObjects[i].id-1].xpos/1000)
								+","+Math.round(game.enemyObjects[this.missionObjects[i].id-1].zpos/1000)
								, 10, 260+(i*20), ctx);
							
						}else{
							this.missionObjects.splice(i, 1); 
							game.player.mission.objectCount -= 1;
						}
					}
				}
			} else if (game.player.mission.location > -1){
				drawText("lime", "Mission Complete!", 10, 200, ctx);
				drawText("yellow", "Go to "+this.interactObjects[game.player.mission.location].name+" "+this.interactObjects[game.player.mission.location].xpos/1000+","+this.interactObjects[game.player.mission.location].zpos/1000 , 10, 240, ctx);
			}
			drawText("white", game.missions[game.player.mission.id].name, 10, 220, ctx);
			
		}
	
		// use UP and DOWN arrow keys to set a movement variable
		// o be used to move the camera forward or backward
		if (keyStatus.thrust && keyStatus.warp && game.player.ship.energy_charge > 0) {
			game.player.ship.speed += game.player.ship.thrust+game.player.ship.warp;
			game.player.ship.energy_charge -= 3;
			game.player.ship.wpn_charge = 0;
		} else if (keyStatus.thrust) {
			game.player.ship.speed += game.player.ship.thrust;
			game.player.ship.energy_charge -= .2;
		}
	
		if (keyStatus.brake) game.player.ship.speed -= game.player.ship.speed/game.player.ship.thrust;
	
		var smovement = 0;
		if (keyStatus.lstrafe) smovement += 1500;
		if (keyStatus.rstrafe) smovement -= 1500;
	
		game.player.ship.speed *= game.player.ship.friction;
		
		if(game.player.ship.speed > 50)	{
			var particle_rate = game.player.ship.speed/100;
			var px, py, pz;
			
			if (particle_rate > 100) particle_rate = 100;
			
			px = this.player.camera.x+(Math.sin(this.player.camera.rotation)*(game.player.ship.speed+900));
			pz = this.player.camera.z+(Math.cos(this.player.camera.rotation)*(game.player.ship.speed+1500));
			for (var i=0; i< particle_rate; i++){
				py = Math.floor((Math.random()*(canvas.height*2)) - (canvas.height)+this.player.camera.y);
				this.activeObjects.push(spawnActiveObject("particle", px+Math.floor((Math.random()*4000) - 2000), py, pz+Math.floor((Math.random()*4000) - 2000), 0));
			}
		}
		// base cameraViewera movement on its own rotation using 
		// movement as a multiplier of the sin and cosine for
		// defining a speed of movement at that angle.
		game.player.ship.xpos += Math.sin(game.player.ship.heading)*game.player.ship.speed;
		game.player.ship.zpos += Math.cos(game.player.ship.heading)*game.player.ship.speed;
		
		//predicted position
		game.player.ship.nextx = game.player.ship.xpos + Math.sin(game.player.ship.heading)*game.player.ship.speed;
		game.player.ship.nextz = game.player.ship.zpos + Math.cos(game.player.ship.heading)*game.player.ship.speed;
		
		//temporary side movement
		game.player.ship.xpos += Math.sin(game.player.ship.heading-Math.PI/2)*smovement;
		game.player.ship.zpos += Math.cos(game.player.ship.heading-Math.PI/2)*smovement;
		
		if (game.player.ship.hull <= 0 ) { 
			obj._visible = false;
		} else {
			this.displayObject(game.player.ship, freqByteData, this.colorPalletWarm, this.colorPalletCold, this.colorPallet);
		}
	}
	
	game.displayObject = function (objectData, soundData, colorPalletWarm, colorPalletCold, colorPallet){
	
		// first shift all coordinate values
		// with the cameraViewera's location
		var x = objectData.xpos - this.player.camera.x;
		var y = objectData.ypos - this.player.camera.y;
		var z = objectData.zpos - this.player.camera.z;
		var tx, ty, tz; // temporary x, y and z variables
		
		//console.log(this.player.camera.x+" - "+y+" - "+objectData.zpos+': '+objectData.type);
		
		// rotation around y axis
		var angle = this.player.camera.rotation;
		tx = Math.cos(angle)*x - Math.sin(angle)*z;
		tz = Math.sin(angle)*x + Math.cos(angle)*z;
		x = tx;
		z = tz;
		// the temporary variabales are used because we dont
		// want the x calculation to be used when calculating
		// z since the x in the x formula needs to be the
		// original x and not the x just solved for
		
			
		// rotation around x axis
		angle = this.player.camera.upAngle;
		ty = Math.cos(angle)*y - Math.sin(angle)*z;
		tz = Math.sin(angle)*y + Math.cos(angle)*z;
		y = ty;
		z = tz;
		// ^ the above recalculates Math.sin and Math.cos

		// point in the scene in respect to the cameraViewera.
		// check to make sure you're in front of the camera
		if (z > 0){
			if (!objectData._visible) objectData._visible = true;
			var scaleRatio = this.player.camera.focalLength/(this.player.camera.focalLength + z);
			objectData._x = x * scaleRatio;
			objectData._y = y * scaleRatio;
			objectData._z = z;
			objectData._xscale = objectData._yscale = 100 * scaleRatio;
			switch(objectData.type)
			{
			case "sun":
				drawSun(objectData._xscale, objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), soundData, objectData.name, colorPalletWarm, ctx);
				break;
			case "planet":
				drawPlanet(objectData._xscale, objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), soundData, objectData.name, ctx);
				break;
			case "SpaceShip1":
				drawEnemy(objectData._xscale, objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), colorPalletCold, ctx);
				break;
			case "particle":
				drawParticle(objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), objectData._xscale, ctx);
				break;
			case "cometparticle":
				drawCometParticle(objectData._xscale, objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), soundData, objectData.life, ctx);
				break;
			case "comet":
				drawComet(objectData._xscale, objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), soundData, colorPalletCold, ctx);
				break;
			case "missile1":
				drawMissile(objectData._xscale, objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), soundData, colorPallet, ctx);
				break;
			case "explosion":
				drawExplosion(objectData._xscale, objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), soundData[55], colorPalletWarm, ctx);
				break;
			case "sparks":
				drawSparks(objectData._xscale, objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), soundData[155], objectData.life, colorPalletWarm[2], ctx);
				break;
			case "player":
				drawEnemy(objectData._xscale, objectData._x+(canvas.width/2), objectData._y+(canvas.height/2), colorPalletCold, ctx);
				break;
			default:
			  console.log("Object doesnt have a model");
			}
		}else{
			// if not in front of the camera, hide
			objectData._visible = false;
		}
	}
	
	return game;
}