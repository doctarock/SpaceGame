function spawnStarScape(){
	var bgObjects = [];
	//splash some stars around
	for (var i=0; i<150; i++){
		bgObjects.push(spawnBackgroundObject("star", Math.floor((Math.random()*50000) - 20000), Math.floor((Math.random()*50000) - 20000), Math.floor((Math.random()*50000) - 10000)));
	}
	// I should do this better
	for (var i=0; i<150; i++){
		bgObjects.push(spawnBackgroundObject("star", -Math.floor((Math.random()*50000) - 20000), -Math.floor((Math.random()*50000) - 20000), -Math.floor((Math.random()*50000) - 10000)));
	}
	return bgObjects;
}

function spawnSystems(){
	var spawnObjects = [ ];
	spawnObjects.push(spawnSun("Astrata", 150000, 0, 150000));
	spawnObjects.push(spawnSun("Lolenta", 31000000, -10000, 900000));
	spawnObjects.push(spawnSun("Sol", -30000000, -10000, -50000));
	return spawnObjects;
}

function spawnInteract(){
	var spawnObjects = [ ];
	spawnObjects.push(spawnPlanets("Enaz", -340000, 0, 150000, 0));
	spawnObjects.push(spawnPlanets("Leeone", 335000, 3000, 150000, 0));
	spawnObjects.push(spawnPlanets("Dezrada", 0, -1000, -15000, 0));
	spawnObjects.push(spawnPlanets("Robanus", 60000, -3000, 550000, 0));
	spawnObjects.push(spawnPlanets("Berlinia", -135000, 0, 350000, 0));

	spawnObjects.push(spawnPlanets("Nasrama", 31015000, 0, 970000, 1));
	spawnObjects.push(spawnPlanets("Zilenus", 31000000, 0, 935000, 1));
	spawnObjects.push(spawnPlanets("Ryzopu", 31050000, 0, 950000, 1));
	spawnObjects.push(spawnPlanets("Kennes", 3105000, 0, 850000, 1));
	
	spawnObjects.push(spawnPlanets("Earth", -30065000, 0, 150000, 2));
	spawnObjects.push(spawnPlanets("Venis", -30505000, 0, 250000, 2));
	spawnObjects.push(spawnPlanets("Mars", -30045000, 0, 350000, 2));
	spawnObjects.push(spawnPlanets("Uranis", -30305000, 0, 450000, 2));
	spawnObjects.push(spawnPlanets("Pluto", -30025000, 0, 550000, 2));
	spawnObjects.push(spawnPlanets("Jupitor", -30015000, 0, 650000, 2));
	return spawnObjects;
}

function spawnSun(name, xc, yc, zc) {
	var attachedObj = {
		name: name,
		type: "sun",
		xpos: xc,
		ypos: yc,
		zpos: zc,
		power: 50000,
		radius: 500,
	};
	return attachedObj;
}

function spawnPlanets(name, xc, yc, zc, sid) {
	var attachedObj = {
		name: name,
		type: "planet",
		xpos: xc,
		ypos: yc,
		zpos: zc,
		power: 50000,
		radius: 13,
		star: sid,
		proximity: 0
	};
	return attachedObj;
}

function spawnBackgroundObject(type, xpos, ypos, zpos){
	var spawnObj = [];
	spawnObj.type = type;
	spawnObj.xpos = xpos;
	spawnObj.ypos = ypos;
	spawnObj.zpos = zpos;
	spawnObj.process = function(soundData, colorPallet, camera){
		var x = this.xpos ;
		var y = this.ypos ;
		var z = this.zpos ;
		var tx, ty, tz; // temporary x, y and z variables
		
		// rotation around y axis
		var angle = camera.rotation;
		tx = Math.cos(angle)*x - Math.sin(angle)*z;
		tz = Math.sin(angle)*x + Math.cos(angle)*z;
		x = tx;z = tz;
		
		// rotation around x axis
		angle = camera.upAngle;
		ty = Math.cos(angle)*y - Math.sin(angle)*z;
		tz = Math.sin(angle)*y + Math.cos(angle)*z;
		y = ty;z = tz;
		
		if (z > 0){
			if (!this._visible) this._visible = true;
			var scaleRatio = camera.focalLength/(camera.focalLength + z);
			this._x = x * scaleRatio;
			this._y = y * scaleRatio;
			this._xscale = this._yscale = 100 * scaleRatio;
			drawStar(this._x+(canvas.width/2), this._y+(canvas.height/2), this._xscale*(2+soundData[760]/10), 5, .1, colorPallet, ctx)
		}else{
			this._visible = false;
		}
	};
	
	return spawnObj;
}

function spawnEnemyObject(type, xc, yc, zc, hc, mission) {
	var spawnObj = [];
	spawnObj.type = type;
	spawnObj.xpos = xc;
	spawnObj.ypos = yc;
	spawnObj.zpos = zc;
	spawnObj.heading = hc;
	spawnObj.speed = 180;
	spawnObj.life = 800;
	spawnObj.life_max = 800;
	spawnObj.tx = 10000;
	spawnObj.tz = 10000;
	spawnObj.power = 20;
	spawnObj.radius = 300;
	spawnObj.decay = 0;
	spawnObj.ai = 2;
	spawnObj.solid = true;
	if (mission == true){
		spawnObj.mission = true;
	} else {
		spawnObj.mission = false;
	}
	
	spawnObj.process = function (damageObjects, ship){
		var randomNum = Math.floor(Math.random()*300)-150;
		var distance = Math.sqrt( Math.pow( ship.xpos - this.xpos, 2 ) + Math.pow( ship.zpos - this.zpos, 2 ) );
		//AI
		// 3: run from player
		
		
		if (this.ai == 1) { 
		// 1: random movement
			if (Math.floor(Math.random()*30) == Math.floor(Math.random()*20)){
				if (Math.floor(Math.random()*2) == 1){
					this.heading += Math.floor(Math.random()*20)/10;
				} else{
					this.heading -= Math.floor(Math.random()*20)/10;
				}
			}
			this.xpos += Math.sin(this.heading)*this.speed;
			this.zpos += Math.cos(this.heading)*this.speed;
		} else if (this.ai == 2) {
		// 2: chase player
			this.heading = Math.atan2(ship.zpos - this.zpos, ship.xpos - this.xpos) * 180 / 3.141593E+000; 
			this.xpos -= Math.sin(this.heading)*this.speed;
			this.zpos += Math.cos(this.heading)*this.speed;
		
			if (distance < 15000)  {
				if (Math.floor(Math.random()*40) == 1){
					var weaponProperties = {wpn_speed: 100, wpn_power:10, wpn_range: 100};
					damageObjects.push(spawnDamageObject("missile1", this.xpos + (Math.sin(this.heading)*10), this.ypos, this.zpos + (Math.cos(this.heading)*10), -this.heading, weaponProperties));
				}
			}
			
		} else if (this.ai == 3) {
		// 3: move away from the player
			this.xpos += Math.sin(this.heading)*this.speed;
			this.zpos += Math.cos(this.heading)*this.speed;
		} else if (this.ai == 4) {
		// 4: circle the player
			this.heading = Math.atan2(this.zpos - ship.zpos, this.xpos - ship.xpos); 
			this.xpos -= Math.sin(this.heading)*this.speed;
			this.zpos += Math.cos(this.heading)*this.speed;
			
			if (distance < 15000)  {
				if (Math.floor(Math.random()*40) == 1){
					var weaponHeading = -(Math.atan2(ship.zpos - this.zpos, ship.xpos - this.xpos) * 180 / 3.141593E+000); 
					var weaponProperties = {wpn_speed: 100, wpn_power:10, wpn_range: 100};
					damageObjects.push(spawnDamageObject("missile1", this.xpos + (Math.sin(weaponHeading)*10), this.ypos, this.zpos + (Math.cos(weaponHeading)*10), weaponHeading, weaponProperties));
				}
			}
			if (randomNum <50){this.ai = 3}
		} else if (this.ai == -1) {
			this.heading += randomNum;
			this.ai = 1;
		}
	
		if (distance < 5000) {
			this.ai = 4;
		}
	
		if (this.ai == 3 || this.ai == 4) {
			if (distance > 30000) {
				this.ai = 1;
			}else if (distance > 25000 && randomNum <50){this.ai = 1}
		} else if (this.ai == 1) {
			if (distance < 25000)  {
				this.ai = 2;
			}
		}
	}
	
	return spawnObj;
}

function spawnMissionObject(type, id, name, objective){
	var spawnObj = [];
	spawnObj.type = type;
	spawnObj.id = id;
	spawnObj.name = name;
	spawnObj.objective = objective;
	
	return spawnObj;
}
function spawnPlayerObject(type, xc, yc, zc, hc, ship) {
var spawnObj = [];
	spawnObj.type = type;
	spawnObj.xpos = xc;
	spawnObj.ypos = yc;
	spawnObj.zpos = zc;
	spawnObj.heading = hc;
	if (type == "missile1") {
		spawnObj.speed = ship.wpn_speed+ship.speed;
		spawnObj.life = ship.wpn_range;
		spawnObj.decay = .1;
		spawnObj.power = ship.wpn_power;
		spawnObj.radius = 100;
		spawnObj.solid = true;
	}
	spawnObj.process = function(activeObjects, enemyObjects, damageObjects){
		if (typeof(this.path) == "object") {
			activeObjects.push(spawnActiveObject("probeparticle", this.xpos+Math.floor((Math.random()*400) - 200), this.ypos, this.zpos+Math.floor((Math.random()*400) - 200), 0));
			if (this.path_pos == this.path.length) {
				this.path_pos = 0;
			}
			
			var currPath = this.path[this.path_pos];
			
			var dist_x = currPath.x-this.xpos;
			var dist_z = currPath.z-this.zpos;
			
			if ((Math.abs(dist_x)+Math.abs(dist_z))<50) {
				if(currPath.end == 1){
					this.life = 0;
				} else{
					this.path_pos++;
				}
			}
			var angle = Math.atan2(dist_z, dist_x);
			this.xpos = this.xpos+this.speed*Math.cos(angle);
			this.zpos = this.zpos+this.speed*Math.sin(angle);
			
		} else {
			this.xpos += Math.sin(this.heading)*this.speed;
			this.zpos += Math.cos(this.heading)*this.speed;
		}
		var distance
		
		for (var i=0; i < enemyObjects.length; i++){
			distance = Math.sqrt( Math.pow( this.xpos - enemyObjects[i].xpos, 2 ) + Math.pow( this.zpos - enemyObjects[i].zpos, 2 ) );
	
			if (distance < 500) {
				enemyObjects[i].life	-= this.power;
				this.life 		-= enemyObjects[i].power;
				activeObjects.push(spawnActiveObject("sparks", enemyObjects[i].xpos, enemyObjects[i].ypos, enemyObjects[i].zpos, 0));		
				if (enemyObjects[i].life <= 0) {
					activeObjects.push(spawnActiveObject("explosion", enemyObjects[i].xpos, enemyObjects[i].ypos, enemyObjects[i].zpos, 0));
					if (enemyObjects[i].mission) {
						for (var j=0; j < missionObjects.length; j++){
							if (missionObjects[j].id == i && missionObjects[j].type == "enemy"){
								this.missionObjects.splice(j, 1);
								game.player.mission.objectCount -= 1;
							}
						}
					}
				}
			}
		}
		for (var i=0; i<damageObjects.length; i++){
			distance = Math.sqrt( Math.pow( this.xpos - damageObjects[i].xpos, 2 ) + Math.pow( this.zpos - damageObjects[i].zpos, 2 ) );
	
			if (distance < 500 && distance != 0) {
				damageObjects[i].life	-= this.power;
				this.life -= damageObjects[i].power;
				activeObjects.push(spawnActiveObject("sparks", damageObjects[i].xpos, damageObjects[i].ypos, damageObjects[i].zpos, 0));
				if (damageObjects[i].life <= 0) {
					activeObjects.push(spawnActiveObject("sparks", damageObjects[i].xpos, damageObjects[i].ypos, damageObjects[i].zpos, 0));
					if (damageObjects[i].mission) {
						
					}
				}
			}
		}
	}
	
	return spawnObj;
}
function spawnDamageObject(type, xc, yc, zc, hc, special, mission) {
	var spawnObj = [];
	spawnObj.type = type;
	spawnObj.xpos = xc;
	spawnObj.ypos = yc;
	spawnObj.zpos = zc;
	spawnObj.heading = hc;
	if (type == "missile1") {
		spawnObj.speed = special.wpn_speed;
		spawnObj.life = special.wpn_range;
		spawnObj.decay = .1;
		spawnObj.power = special.wpn_power;
		spawnObj.radius = 100;
		spawnObj.solid = true;
	} else if (type == "Lightnings") {
		spawnObj.speed = 800;
		spawnObj.life = 100;
		spawnObj.power = 10;
		spawnObj.radius = 250;
		spawnObj.decay = 1;
		spawnObj.ai = -1;
		spawnObj.solid = true;
	} else if (type == "comet") {
		spawnObj.speed = 80;
		spawnObj.life = 20000;
		spawnObj.decay = 0;
		spawnObj.radius = 400;
		spawnObj.power = 100;
		spawnObj.solid = true;
		spawnObj.path = special;
		spawnObj.path_pos = 0;
	}
	if (mission == true){
		spawnObj.mission = true;
	} else {
		spawnObj.mission = false;
	}
	
	spawnObj.process = function(activeObjects, enemyObjects, damageObjects, ship, cameraView){
		if (typeof(this.path) == "object") {
			activeObjects.push(spawnActiveObject("cometparticle", this.xpos+Math.floor((Math.random()*400) - 200), this.ypos, this.zpos+Math.floor((Math.random()*400) - 200), 0));
			if (this.path_pos == this.path.length) {
				this.path_pos = 0;
			}
			
			var currPath = this.path[this.path_pos];
			
			var dist_x = currPath.x-this.xpos;
			var dist_z = currPath.z-this.zpos;
			
			if ((Math.abs(dist_x)+Math.abs(dist_z))<50) {
				if(currPath.end == 1){
					this.life = 0;
				} else{
					this.path_pos++;
				}
			}
			var angle = Math.atan2(dist_z, dist_x);
			this.xpos = this.xpos+this.speed*Math.cos(angle);
			this.zpos = this.zpos+this.speed*Math.sin(angle);
			
		} else {
			this.xpos += Math.sin(this.heading)*this.speed;
			this.zpos += Math.cos(this.heading)*this.speed;
		}
		var distance
		distance = Math.sqrt( Math.pow( this.xpos - cameraView.x, 2 ) + Math.pow( this.zpos - cameraView.z, 2 ) );
		if (distance < 500) {
			ship.hull	-= this.power;
			this.life -= 20;
			drawShipDamage(canvas.width,canvas.height, ctx);
		} else {
			for (var i=0; i < enemyObjects.length; i++){
				distance = Math.sqrt( Math.pow( this.xpos - enemyObjects[i].xpos, 2 ) + Math.pow( this.zpos - enemyObjects[i].zpos, 2 ) );
		
				if (distance < 500) {
					enemyObjects[i].life	-= this.power;
					this.life 		-= enemyObjects[i].power;
					activeObjects.push(spawnActiveObject("sparks", enemyObjects[i].xpos, enemyObjects[i].ypos, enemyObjects[i].zpos, 0));		
					if (enemyObjects[i].life <= 0) {
						activeObjects.push(spawnActiveObject("explosion", enemyObjects[i].xpos, enemyObjects[i].ypos, enemyObjects[i].zpos, 0));	
					}
				}
			}
			for (var i=0; i<damageObjects.length; i++){
				distance = Math.sqrt( Math.pow( this.xpos - damageObjects[i].xpos, 2 ) + Math.pow( this.zpos - damageObjects[i].zpos, 2 ) );
		
				if (distance < 500 && distance != 0) {
					damageObjects[i].life	-= this.power;
					this.life -= damageObjects[i].power;
					activeObjects.push(spawnActiveObject("sparks", damageObjects[i].xpos, damageObjects[i].ypos, damageObjects[i].zpos, 0));
					if (damageObjects[i].life <= 0) {
						activeObjects.push(spawnActiveObject("sparks", damageObjects[i].xpos, damageObjects[i].ypos, damageObjects[i].zpos, 0));
					}
				}
			}
		}
		
	}
	
	return spawnObj;
}

function spawnActiveObject(type, xc, yc, zc, hc) {
	var spawnObj = [];
	spawnObj.name = type;
	spawnObj.type = type;
	
	 if (type == "particle") {
		spawnObj.speed = 0;
		spawnObj.life = 10;
		spawnObj.power = 0;
		spawnObj.radius = 0;
		spawnObj.decay = .5;
		spawnObj.ai = 0;
		spawnObj.solid = false;
	} else if (type == "cometparticle") {
		spawnObj.speed = 0;
		spawnObj.life = 10;
		spawnObj.power = 0;
		spawnObj.radius = 0;
		spawnObj.decay = .2;
		spawnObj.ai = 0;
		spawnObj.solid = false;
	} else if (type == "explosion") {
		spawnObj.speed = 0;
		spawnObj.life = 13;
		spawnObj.decay = 1;
		spawnObj.power = 0;
		spawnObj.solid = false;
	} else if (type == "sparks") {
		spawnObj.speed = 0;
		spawnObj.life = 5;
		spawnObj.decay = 1;
		spawnObj.power = 0;
		spawnObj.solid = false;
	}
	
	spawnObj.heading = hc;
	spawnObj.xpos = xc;
	spawnObj.ypos = yc;
	spawnObj.zpos = zc;
	spawnObj.process = function(activeObjects){
		if (typeof(this.path) == "object") {
			activeObjects.push(spawnActiveObject("cometparticle", this.xpos+Math.floor((Math.random()*400) - 200), this.ypos, this.zpos+Math.floor((Math.random()*400) - 200), 0));
			if (this.path_pos == this.path.length) {
				this.path_pos = 0;
			}
			
			var currPath = this.path[this.path_pos];
			
			var dist_x = currPath.x-this.xpos;
			var dist_z = currPath.z-this.zpos;
			
			if ((Math.abs(dist_x)+Math.abs(dist_z))<50) {
				this.path_pos++;
			}
			var angle = Math.atan2(dist_z, dist_x);
			this.xpos = this.xpos+this.speed*Math.cos(angle);
			this.zpos = this.zpos+this.speed*Math.sin(angle);
			
		} else {
			this.xpos += Math.sin(this.heading)*this.speed;
			this.zpos += Math.cos(this.heading)*this.speed;
		}
		this.life -= this.decay;
	};
	return spawnObj;
}