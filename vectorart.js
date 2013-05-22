function graphicsEngine(){
	var draw = [ ];
	
	draw.playerDamage = function(width, height, ctx){
		ctx.fillStyle = "rgba(255, 76, 55, 0.7)";
		ctx.fillRect(0,0,width,height);
	}
	
	return draw;
}
function drawShipDamage(width, height, ctx){
	ctx.fillStyle = "rgba(255, 76, 55, 0.7)";
	ctx.fillRect(0,0,width,height);
}

function drawStar(x, y, r, p, m, colorPallet, ctx)
{
	ctx.save();
	ctx.beginPath();
	ctx.translate(x, y);
	ctx.moveTo(0,0-r);

	ctx.fillStyle = colorPallet[Math.floor(Math.random()*6)-1];

	for (var i = 0; i < p; i++)
	{
		ctx.rotate(Math.PI / p);
		ctx.lineTo(0, 0 - (r*m));
		ctx.rotate(Math.PI / p);
		ctx.lineTo(0, 0 - r);
	}
	ctx.fill();
	ctx.restore();
}

function drawParticle(xpos, ypos, scale, ctx){
	ctx.save();
	ctx.beginPath();
	ctx.arc(xpos, ypos, scale/20, 0, 2 * Math.PI, false);
	ctx.fillStyle = "#ffffff";
	ctx.fill();	
	ctx.restore();
}

function drawText(color, text, xpos, ypos, ctx){
	if (color === ""){color = "#ffffff"}
	ctx.save();
	ctx.font = "italic 13pt Calibri";
	ctx.fillStyle = color;
	ctx.fillText(text, xpos, ypos); 
	ctx.restore();
}

function deathScene(x,y,ctx){
	ctx.font = "italic 48pt Calibri";
	ctx.fillStyle = "red";
	ctx.fillText("GAME OVER", x, y); 
}

function drawMainMenu(width, height, ctx){
		ctx.font = "48pt 'Ruslan Display'";
		ctx.fillStyle = "red";
		ctx.fillText("Deekiki Galaxy", (width/2)-260, 150); 
		ctx.fillStyle = "white";
		ctx.font = "18pt Electrolize";
		ctx.fillText("A Sandbox Galaxy Adventure", (width/2)-150, 180);
		
		ctx.fillText("A / Right Click: accellerate", (width/2)-150, 280); 
		ctx.fillText("Ctrl/Left Click: fire", (width/2)-150, 300); 
		ctx.fillText("Z: decelerate", (width/2)-150, 340); 
		ctx.fillText("C: communicate", (width/2)-150, 320); 
		
		ctx.font = "italic 48pt Electrolize";
		ctx.fillStyle = "yellow";
		ctx.fillText("hit enter to start", (width/2)-240, height-50); 	
}

function drawCommMenu(width, height, planet, mission, ctx){
		ctx.fillStyle = "blue";
		ctx.fillRect(50,50,width-100,height-100);
		ctx.fillStyle = "#003366";
		ctx.fillRect(55,55,width-110,height-110);
		ctx.font = "italic 48pt Calibri";
		ctx.fillStyle = "red";
		ctx.fillText(planet.name, 80, 80); 
		ctx.fillStyle = "white";
		ctx.font = "18pt Calibri";
		ctx.fillText("Mission: "+mission.name, 70, 180); 
		ctx.fillText(mission.description, 70, 210); 
		ctx.fillText(mission.description2, 70, 240); 
		ctx.fillText("Reward: "+mission.reward, 70, 270); 
		ctx.font = "italic 24pt Calibri";
		ctx.fillStyle = "yellow";
		ctx.fillText("enter to accept, c to exit", (width/2), height-60); 	
}

function drawRewardMenu(width, height, planet, mission, ctx){
		ctx.fillStyle = "blue";
		ctx.fillRect(50,50,width-100,height-100);
		ctx.fillStyle = "#003366";
		ctx.fillRect(55,55,width-110,height-110);
		ctx.font = "italic 48pt Calibri";
		ctx.fillStyle = "red";
		ctx.fillText(planet.name, 80, 80); 
		ctx.fillStyle = "yellow";
		ctx.font = "18pt Calibri";
		ctx.fillText("Mission Complete! "+mission.name, 70, 180);
		ctx.fillStyle = "white";
		ctx.fillText("Reward: "+mission.reward, 70, 270); 
		ctx.font = "italic 24pt Calibri";
		ctx.fillStyle = "yellow";
		ctx.fillText("enter to continue", (width/2), height-60); 	
}

function drawExplosion(scale, xpos, ypos, soundData, colorPalletWarm, ctx){
	ctx.save();
	ctx.beginPath();
	var radius = Math.round((scale*4)+(scale*(soundData/25)));
	ctx.arc(xpos, ypos, radius, 0, 2 * Math.PI, false);
	var grd = ctx.createRadialGradient(xpos, ypos, (scale*4), xpos, ypos, radius);
	grd.addColorStop(0, colorPalletWarm[Math.round((soundData/10)/2)]);
	grd.addColorStop(1, "rgba(255, 76, 50, 0.5)");
	ctx.fillStyle = grd;
	ctx.fill();	
}

function drawPlanet(scale, xpos, ypos, soundData, name, ctx){
	ctx.save();
	ctx.beginPath();
	ctx.arc(xpos, ypos, scale*(2+soundData[0]/10), 0, 2 * Math.PI, false);
	ctx.lineWidth = 1;
	var grd = ctx.createRadialGradient(xpos, ypos, 1, xpos, ypos, scale*13+(soundData[325]/8));
	grd.addColorStop(0, "#07bf4c");
	grd.addColorStop(.9, "#046a2a");
	grd.addColorStop(1, "rgba(0, 76, 255, 0.2)");
	ctx.fillStyle = grd;
	ctx.fill();
	if (scale > .1){
		ctx.font = "italic 13pt Calibri";
		ctx.fillStyle = "white";
		ctx.fillText(name, xpos, ypos-10); 
	}
	ctx.restore();
}

function drawSun(scale, xpos, ypos, soundData, name, colorPalletWarm, ctx){

	var points = soundData[420];
	var radius = scale*700;

	ctx.save();
	ctx.beginPath();
	ctx.translate(xpos, ypos);
	ctx.moveTo(0,0-radius);

	ctx.fillStyle = colorPalletWarm[Math.round(soundData[105]/10)];

	for (var i = 0; i < points; i++)
	{
		ctx.rotate(Math.PI / points);
		ctx.lineTo(0, 0 - (radius*.8));
		ctx.rotate(Math.PI / points);
		ctx.lineTo(0, 0 - radius);
	}
	ctx.fill();
	ctx.restore();

	ctx.save();
	ctx.beginPath();
	ctx.arc(xpos, ypos, scale*(500+soundData[325]/5), 0, 2 * Math.PI, false);
	ctx.lineWidth = 1;
	ctx.strokeStyle = "white";
	ctx.stroke();

	var grd = ctx.createRadialGradient(xpos, ypos, 1, xpos, ypos, scale*500);
	grd.addColorStop(0, "white");
	grd.addColorStop(1, colorPalletWarm[Math.round(soundData[55]/10)]);
	ctx.fillStyle = grd;
	ctx.fill();
	if (scale > .1){
		ctx.font = "italic 13pt Calibri";
		ctx.fillStyle = "white";
		ctx.fillText(name+" "+scale, xpos+100, ypos-scale); 
	}
	ctx.restore();
}

function drawMissile(scale, xpos, ypos, soundData, colorPallet, ctx){
	var points = 3+Math.round(soundData[120]/20);
	var radius = Math.round(scale*(soundData[55]/20)/4);

	ctx.save();
	ctx.beginPath();
	ctx.translate(xpos, ypos);
	ctx.moveTo(0,0-radius);

	var grd = ctx.createRadialGradient(0, 0, 1, 0, 0, radius);
	grd.addColorStop(0, colorPallet[Math.round((soundData[55]/10)/2)]);
	grd.addColorStop(1, "rgba(0, 76, 255, 0.5)");
	ctx.fillStyle = grd;

	for (var i = 0; i < points; i++)
	{
		ctx.rotate(Math.PI / points);
		ctx.lineTo(0, 0 - (radius*.8));
		ctx.rotate(Math.PI / points);
		ctx.lineTo(0, 0 - radius);
	}
	ctx.fill();
	ctx.restore();

}

function drawEnemy(scale, xpos, ypos, colorPalletCold, ctx){
	ctx.save();
	ctx.beginPath();
	ctx.arc(xpos, ypos, scale*2, 0, 2 * Math.PI, false);
	ctx.fillStyle = "#ccccff";
	ctx.fill();	
	ctx.restore();

	//ship huill
	var grd = ctx.createRadialGradient(0, 0, 10, 0, 0, scale*2);
	grd.addColorStop(0, colorPalletCold[5]);
	grd.addColorStop(1, colorPalletCold[15]);

	ctx.save();
	ctx.translate(xpos, ypos);
	ctx.scale(2, 1);
	ctx.beginPath();
	ctx.arc(0, 0, scale*2, 0, Math.PI, false);
	ctx.fillStyle = grd;
	ctx.fill();	
	ctx.restore();

	//head
	ctx.save();
	ctx.beginPath();
	ctx.arc(xpos, ypos-(.8*scale), scale/1.5, 0, 2 * Math.PI, false);
	ctx.fillStyle = "green";
	ctx.fill();	
	ctx.restore();

	//anentenai L
	ctx.save();
	ctx.beginPath();
	ctx.arc(xpos-(.5*scale), ypos-(1.7*scale), scale/5, 0, 2 * Math.PI, false);
	ctx.fillStyle = "green";
	ctx.fill();	
	ctx.restore();

	//ctx.save();
	ctx.beginPath();
	ctx.arc(xpos+(.5*scale), ypos-(1.7*scale), scale/5, 0, 2 * Math.PI, false);
	ctx.fillStyle = "green";
	ctx.fill();	
	ctx.restore();
}

function drawComet(scale, xpos, ypos, soundData, colorPalletCold, ctx){
	ctx.save();
	ctx.beginPath();
	var radius = Math.round(scale*5);
	ctx.arc(xpos, ypos, radius, 0, 2 * Math.PI, false);
	var grd = ctx.createRadialGradient(xpos, ypos, (scale*2), xpos, ypos, radius);
	grd.addColorStop(0, colorPalletCold[Math.round((soundData[55]/10)/2)]);
	grd.addColorStop(1, "rgba(255, 255, 255, 0.2)");
	ctx.fillStyle = grd;
	ctx.fill();	
}

function drawCometParticle(scale, xpos, ypos, soundData, life, ctx){
	ctx.save();
	ctx.beginPath();
	var radius = Math.round((scale*5))*(Math.round(life)/10);
	ctx.arc(xpos, ypos, radius, 0, 2 * Math.PI, false);
	var grd = ctx.createRadialGradient(xpos, ypos, (scale), xpos, ypos, radius);
	grd.addColorStop(0, "rgba(152, 248, 248, "+Math.round(life)/10+")");
	grd.addColorStop(1, "rgba(255, 255, 255, .1)");
	ctx.fillStyle = grd;
	ctx.fill();	
}

function drawSparks(scale, xpos, ypos, soundData, life, colorPalletWarm, ctx){
	ctx.save();
	ctx.beginPath();
	var radius = Math.round(scale+(scale*(soundData/20)));
	var rand1 = Math.floor(Math.random()*40)-20;
	var rand2 = Math.floor(Math.random()*40)-20;
	ctx.arc(xpos+rand1, ypos+rand2, radius, 0, 2 * Math.PI, false);
	var grd = ctx.createRadialGradient(xpos, ypos, scale, xpos, ypos, radius);
	grd.addColorStop(0, colorPalletWarm);
	grd.addColorStop(1, "rgba(255, 76, 50, .1)");
	ctx.fillStyle = grd;
	ctx.fill();	
}

function HUD(ship, cred, ctx){
	drawText("white", "sector: "+Math.round(ship.xpos/1000)+ " " + Math.round(ship.zpos/1000), 10, 20, ctx)
	
	ctx.fillStyle = 'red';
	ctx.fillRect(10,30,120,15);
	var healthpc = (ship.hull/ship.hull_max)*120;
	ctx.fillStyle = 'lime';
	ctx.fillRect(10,30,healthpc,15);
	drawText("black", "hull integrity", 15, 40, ctx);
	
	ctx.fillStyle = 'red';
	ctx.fillRect(10,50,120,15);
	var healthpc = (ship.wpn_charge/ship.wpn_max)*120;
	ctx.fillStyle = 'lime';
	ctx.fillRect(10,50,healthpc,15);
	drawText("black", "weapon charge", 15, 60, ctx);
	
	ctx.fillStyle = 'red';
	ctx.fillRect(10,70,120,15);
	var healthpc = (ship.energy_charge/ship.energy_max)*120;
	ctx.fillStyle = 'lime';
	ctx.fillRect(10,70,healthpc,15);
	drawText("black", "engine power", 15, 80, ctx);

	drawText("white", "speed: "+Math.round(ship.speed), 10, 100, ctx);
	
	drawText("white", "credit: "+cred, 10, 120, ctx);
}