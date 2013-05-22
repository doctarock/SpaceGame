function missionDestroyComet(){
	var missionObj = {
		name: "Destroy Comet",
		description: "Help! A massive comet is heading towards our planet, ",
		description2: "destory it for us before we all die!",
		reward: 3000,
		done: "That was a close one, thanks for your help.",
		objectCount: 1
	};
	missionObj.StartMission = function(game, mission){
		mission.destination = game.player.comm_channel;
		var xpos = game.interactObjects[mission.destination].xpos;
		var ypos = game.interactObjects[mission.destination].zpos;
		game.player.mission.location = game.player.comm_channel;
		game.damageObjects.push(spawnDamageObject("comet", xpos+50000, 0, ypos+50000, 0, game.plotPath(xpos+50000, ypos+50000, xpos, ypos, false), true));
		game.missionObjects.push(spawnMissionObject("damage", game.damageObjects.length, "Comet", 1))
	}
	return missionObj;
}
function missionDestroyShips(){
	var missionObj = {
		name: "Destroy Ships",
		description: "Help! Our planet is under attack destory all enemy ships for us!",
		description2: "",
		reward: 3000,
		status: 0,
		done: "That will teach the suckers! Here is your reward.",
		objectCount: 2,
		destination: -1
	};
	missionObj.StartMission = function(game, mission){
		mission.destination = game.player.comm_channel;
		var xpos = game.interactObjects[mission.destination].xpos;
		var ypos = game.interactObjects[mission.destination].ypos;
		game.player.mission.location = game.player.comm_channel;
		game.enemyObjects.push(spawnEnemyObject("SpaceShip1", xpos+Math.floor(Math.random()*10000 - 5000), 0, ypos+Math.floor(Math.random()*10000 - 5000), 0));
		game.missionObjects.push(spawnMissionObject("enemy", game.enemyObjects.length, "Ship", 1))
		game.enemyObjects.push(spawnEnemyObject("SpaceShip1", xpos+Math.floor(Math.random()*10000 - 5000), 0, ypos+Math.floor(Math.random()*10000 - 5000), 0));
		game.missionObjects.push(spawnMissionObject("enemy", game.enemyObjects.length, "Ship", 1))
	}
	return missionObj;
}
function missionDeliverPackage(game){
	var randomPlanet = Math.floor(Math.random()*game.interactObjects.length);
	var junkList = [ 'sprockets', 'slaves', 'medical supplies', 'fuel cells', 'isotopes', 'electronics', 'escorts', 'pizza', 'supplies', 'luxury goods' ];
	var randomJunk = Math.floor(Math.random()*junkList.length);
	var missionObj = {
		name: "Deliver Package",
		description: "We have an urgent delivery of "+junkList[randomJunk]+" we need ",
		description2: "delivered to "+game.interactObjects[randomPlanet].name+", please deliver this straight away",
		reward: 3000,
		status: 0,
		done: "That will teach the suckers! Here is your reward.",
		objectCount: 0,
		destination: randomPlanet
	};
	missionObj.StartMission = function(game, mission){
		game.player.mission.location = mission.destination;
	}
	return missionObj;
}

function missionTutorial(game){
	var missionObj = {
		name: "Tutorial",
		description: "Welcome to Deekiki Galaxy pilot, lets get you started!",
		description2: "Press A to accellerate and Z to decelerate",
		reward: 3000,
		status: 0,
		done: "That will teach the suckers! Here is your reward.",
		objectCount: 0,
		chain: 1,
		destination: randomPlanet
	};
	missionObj.StartMission = function(game, mission){
		game.player.mission.location = mission.destination;
	}
	return missionObj;
}