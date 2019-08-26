/* Just your standard canvas object and its graphics object. */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

/* This is how we keep track of time in the game, should you require it. */
var timeTicks = 0;

/* This is an array that will contain all the objects we want rendered and updated in the game. */
var elements = [];

/* Array that hold the keycodes of the buttons we press. */
var keysPressed = [];

/* TODO: Maybe will be used in the future to allow us to store captured locations of mouse clicks. */
var mousePressed = [];

/* This holds all the level objects from level1.js, so we can load them as needed. */
var levels = [];
/* Just keeps track of which level we want to load. */
var currentLevel = 0;

/* This is the function used to laod the next level in the game. Currently, the ending leaves a lot to be desired. */
function nextLevel(){
	currentLevel++;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(currentLevel < levels.length){
		elements = levels[currentLevel].get();
	}else{
		alert("You won!");
		canvas.width = 0;
		canvas.height = 0;
		document.body.style.color = "rgb(77, 77, 255)";
		document.body.style.textAlign = "center";
		document.body.append("GOOD JOB!");
		canvas.style.display = "none";
		currentLevel = 0;
	}
}

/* Played whenever we want to reload the current level if the player dies or something. */
function resetLevel(){
	elements = levels[currentLevel].get();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* Resposible for rendering the objets in elements. */
function render(){
	for(i=0; i<elements.length; i++){
		if(elements[i].inGame){
			elements[i].render();
		}
	}
	ctx.fillStyle = "rgba(165, 242, 243, 0.05)";
	ctx.fillRect(0,0, canvas.width, canvas.height);
}

/* Resposible for updating the objets in elements. */
function update(){
	for(l=0; l<elements.length; l++){
		if(elements[l].inGame){
			elements[l].update();
		}
	}
}


/* This is the player object. You can probably guess what the properties are for. */
var Player = function(){
	this.inGame = true;
	this.x = 0;
	this.y = 0;
	
	this.startX = 0;
	this.startY = 0;
	
	this.vx = 0;
	this.vy = 0;
	
	this.w = 10;
	this.h = 10;
	
	this.id = "player";
	
	this.color = "rgba(77, 197, 214, 255)";
	
	this.startSpeed = 0.01;
	
	this.speed = this.startSpeed;
	
	this.bouncyThresh = 1.7;
	this.bouncyness = 5;
	
	/* This just checks to see what we have collided into, and returns an array of the objects we are in contact with. ONLY DOES SQUARED BECAUSE IM LAZY. */
	this.collision = function(){
		var collisions = [];
		for(k=0; k<elements.length; k++){
			var rect = elements[k];
			if(rect != this && rect.inGame){
				if (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y) {
					//console.log(this.id + " collided with " + rect.id);
					collisions.push(rect);
				}
			}
		}
		return collisions;
	}
	
	/* This just resets the player, and not the level, and also plays the death animation from util1.js. Changing the starting positions after colliding with a powerup creates a checkpoint BTW. */
	this.reset = function(){
		this.x = this.startX;
		this.y = this.startY;
		this.vx = 0;
		this.vy = 0;
		playDeath();
	}
	
	/* Designed to be overrided in the level1.js file levels, this function tells the object what to do with each object we collided with. */
	this.interact = function(o){
		if(o.id == "enemy"){
			this.reset();
		}
		if(o.id == "projectile"){
			resetLevel();
		}
	}
	
	/* Just updates the Player object. */
	this.update = function(){
		
		//w 87
		if(keysPressed.includes(87)){
			this.vy-=this.speed;
		}
		//s 83
		if(keysPressed.includes(83)){
			this.vy+=this.speed;
		}
		//a 65
		if(keysPressed.includes(65)){
			this.vx-=this.speed;
		}
		//d 68
		if(keysPressed.includes(68)){
			this.vx+=this.speed;
		}
		
		//r 82
		if(keysPressed.includes(82)){
			resetLevel();
		}
		
		this.x+=this.vx;
		this.y+=this.vy;
		
		/* This prevents the player from going off-screen. */
		if(this.y < 0){
			this.y = 0;
			if(this.vy<-this.bouncyThresh){
				this.vy/=-this.bouncyness;
			}else{
				this.vy = 0;
			}
		}
		if(this.y+this.h > canvas.height){
			this.y = canvas.height-this.h;
			if(this.vy>this.bouncyThresh){
				this.vy/=-this.bouncyness;
			}else{
				this.vy = 0;
			}
		}
		if(this.x < 0){
			this.x = 0;
			if(this.vx<-this.bouncyThresh){
				this.vx/=-this.bouncyness;
			}else{
				this.vx = 0;
			}
		}
		if(this.x+this.w > canvas.width){
			this.x = canvas.width-this.w;
			if(this.vx>this.bouncyThresh){
				this.vx/=-this.bouncyness;
			}else{
				this.vx = 0;
			}
		}
		
		/* Here is where we call the collision stuff. */
		var collisions = this.collision();
		for(i=0; i<collisions.length; i++){
			this.interact(collisions[i]);
		}
	}
	
	/* Renders the Player model. */
	this.render = function(){
		var rect = {x: 0, y: 0, w: canvas.width, h: canvas.height};
		if (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y) {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}
	}
	
}

/* Pretty much the same as the Player object, with a few differences. */
var Enemy = function(){
	this.inGame = true;
	this.x = 0;
	this.y = 0;
	
	this.startX = 0;
	this.startY = 0;
	
	this.vx = 0;
	this.vy = 0;
	
	this.w = 10;
	this.h = 10;
	
	this.color = "rgba( 211, 29, 140, 255)";
	
	this.id = "enemy";
	
	this.speed = 0.2;
	
	/* This is used to store positions that you want the object to go between. There needs to be an even number of doubles and or ints in the array. The first 2 are the x and y pos of the first position. The next two are the position of the second coordinate, and so on and so forth. */
	this.patrolArea = [];
	
	/* This tells the Enemy what position they are targeting in the patrolArea array. */
	this.currentPatrolArea = -1;
	
	this.bouncyThresh = 1.7;
	this.bouncyness = 5;
	
	/* If you have an object you want to parent this to, change this value to that object. Use starting positions as an offset to the parent. */
	this.parentedTo = null;
	
	this.collision = function(){
		var collisions = [];
		for(i=0; i<elements.length; i++){
			var rect = elements[i];
			if(rect != this && rect.inGame){
				if (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y) {
					//console.log(this.id + " collided with " + rect.id);
					collisions.push(rect);
				}
			}
		}
		return collisions;
	}
	
	this.reset = function(){
		this.vx = 0;
		this.vy = 0;
	}
	
	this.interact = function(){}
	
	this.update = function(){
		
		/* This is responsible for doing the parentedTo crap. */
		if(this.parentedTo == null){
			if(this.currentPatrolArea != null && this.currentPatrolArea < this.patrolArea.length/2 && this.patrolArea.length >= 2){
				var tx = this.patrolArea[this.currentPatrolArea*2];
				var ty = this.patrolArea[this.currentPatrolArea*2+1];
				//console.log(tx + " " + ty);
				if(this.x < tx){
					//this.vx=this.speed;
					this.vx=getVel(this.speed, this.x, this.y, tx, ty)[0];
				}else if(this.x > tx){
					//this.vx = -this.speed;
					this.vx=-getVel(this.speed, this.x, this.y, tx, ty)[0];
				}else if(( Math.abs(parseInt(this.x)-tx) <= 1) ){
					this.vx = 0;
				}
				//console.log("X: " + Math.abs(parseInt(this.x)-tx) + " " + ( Math.abs(parseInt(this.x)-tx) <= 2 ) );
				if(this.y < ty){
					//this.vy = this.speed;
					this.vy=getVel(this.speed, this.x, this.y, tx, ty)[1];
				}else if(this.y > ty){
					//this.vy = -this.speed;
					this.vy=-getVel(this.speed, this.x, this.y, tx, ty)[1];
				}else if(( Math.abs(parseInt(this.y)-ty) <= 1) ){
					this.vy = 0;
					//console.log("Y: " + Math.abs(parseInt(this.y)-ty) );
				}
				//console.log("Y: " + Math.abs(parseInt(this.y)-ty) + " " + ( Math.abs(parseInt(this.y)-ty) <= 2 ) );
				
				if(( Math.abs(parseInt(this.y)-ty) <= 2) && ( Math.abs(parseInt(this.x)-tx) <= 2)){
					this.currentPatrolArea++;
					//console.log("ADDING");
				}
			}else{
				this.currentPatrolArea = 0;
			}
			
			this.x+=this.vx;
			this.y+=this.vy;
		}else{
			
			this.x = this.parentedTo.x+this.startX;
			this.y = this.parentedTo.y+this.startY;
			
		}
		
		var collisions = this.collision();
		for(k=0; k<collisions.length; k++){
			this.interact();
		}
		
	}
	
	this.render = function(){
		var rect = {x: 0, y: 0, w: canvas.width, h: canvas.height};
		if (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y) {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}
	}
	
}

/* This is what we use as powerups in the game. Basically just another Enemy class. */
var Powerup = function(){
	this.inGame = true;
	this.x = 0;
	this.y = 0;
	
	this.startX = 0;
	this.startY = 0;
	
	this.vx = 0;
	this.vy = 0;
	
	this.w = 10;
	this.h = 10;
	
	this.color = "rgba(128, 221, 17, 255)";
	
	this.id = "powerup";
	
	this.speed = 0.2;
	
	this.patrolArea = [];
	
	this.currentPatrolArea = -1;
	
	this.bouncyThresh = 1.7;
	this.bouncyness = 5;
	
	this.parentedTo = null;
	
	this.collision = function(){
		var coll = [];
		for(i=0; i<elements.length; i++){
			var rect = elements[i];
			if(rect != this && rect.inGame){
				if (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y) {
					//console.log(this.id + " collided with " + rect.id);
					coll.push(rect);
				}
			}
		}
		return coll;
	}
	
	/* Override this in the level to make it do whatever you want when it collides with something. */
	this.interact = function(o){
		
		if(o.id == "player"){
			o.speed+=0.01;
			//console.log("Setting " + o.id + " speed to: " + o.speed);
		}
		//console.log(this.id + " collided with " + o.id + " " + (o.id == "player"));
		
		for(k=0; k<elements.length; k++){
			
			if(elements[k] == this){
				elements.splice(k, 1);
				break;
				//k--;
			}
		}
	}
	
	this.update = function(){
		if(this.parentedTo == null){
			if(this.currentPatrolArea != null && this.currentPatrolArea < this.patrolArea.length/2 && this.patrolArea.length >= 2){
				var tx = this.patrolArea[this.currentPatrolArea*2];
				var ty = this.patrolArea[this.currentPatrolArea*2+1];
				//console.log(tx + " " + ty);
				if(this.x < tx){
					//this.vx=this.speed;
					this.vx=getVel(this.speed, this.x, this.y, tx, ty)[0];
				}else if(this.x > tx){
					//this.vx = -this.speed;
					this.vx=-getVel(this.speed, this.x, this.y, tx, ty)[0];
				}else if(( Math.abs(parseInt(this.x)-tx) <= 1) ){
					this.vx = 0;
				}
				//console.log("X: " + Math.abs(parseInt(this.x)-tx) + " " + ( Math.abs(parseInt(this.x)-tx) <= 2 ) );
				if(this.y < ty){
					//this.vy = this.speed;
					this.vy=getVel(this.speed, this.x, this.y, tx, ty)[1];
				}else if(this.y > ty){
					//this.vy = -this.speed;
					this.vy=-getVel(this.speed, this.x, this.y, tx, ty)[1];
				}else if(( Math.abs(parseInt(this.y)-ty) <= 1) ){
					this.vy = 0;
					//console.log("Y: " + Math.abs(parseInt(this.y)-ty) );
				}
				//console.log("Y: " + Math.abs(parseInt(this.y)-ty) + " " + ( Math.abs(parseInt(this.y)-ty) <= 2 ) );
				
				if(( Math.abs(parseInt(this.y)-ty) <= 2) && ( Math.abs(parseInt(this.x)-tx) <= 2)){
					this.currentPatrolArea++;
					//console.log("ADDING");
				}
			}else{
				this.currentPatrolArea = 0;
			}
			
			this.x+=this.vx;
			this.y+=this.vy;
		}else{
			
			this.x = this.parentedTo.x+this.startX;
			this.y = this.parentedTo.y+this.startY;
			
		}
		
		var collisions = this.collision();
		for(k=0; k<collisions.length; k++){
			this.interact(collisions[k]);
		}
		
	}
	
	this.render = function(){
		var rect = {x: 0, y: 0, w: canvas.width, h: canvas.height};
		if (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y) {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}
	}
	
}

/* Just another Enemy, but it instantly kills you instead of resetting you. */
var Projectile = function(){
	this.inGame = true;
	this.x = 0;
	this.y = 0;
	
	this.startX = 0;
	this.startY = 0;
	
	this.vx = 0;
	this.vy = 0;
	
	this.w = 10;
	this.h = 10;
	
	this.color = "rgb( 181, 30, 30)";
	
	this.id = "projectile";
	
	this.speed = 0.3;
	
	this.patrolArea = [];
	
	this.currentPatrolArea = -1;
	
	this.bouncyThresh = 1.7;
	this.bouncyness = 5;
	
	this.parentedTo = null;
	
	this.collision = function(){
		var collisions = [];
		for(i=0; i<elements.length; i++){
			var rect = elements[i];
			if(rect != this && rect.inGame){
				if (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y) {
					//console.log(this.id + " collided with " + rect.id);
					collisions.push(rect);
				}
			}
		}
		return collisions;
	}
	
	this.reset = function(){
		this.vx = 0;
		this.vy = 0;
	}
	
	this.interact = function(o){
		
	}
	
	this.update = function(){
		
		if(this.parentedTo == null){
			if(this.currentPatrolArea != null && this.currentPatrolArea < this.patrolArea.length/2 && this.patrolArea.length >= 2){
				var tx = this.patrolArea[this.currentPatrolArea*2];
				var ty = this.patrolArea[this.currentPatrolArea*2+1];
				//console.log(tx + " " + ty);
				if(this.x < tx){
					//this.vx=this.speed;
					this.vx=getVel(this.speed, this.x, this.y, tx, ty)[0];
				}else if(this.x > tx){
					//this.vx = -this.speed;
					this.vx=-getVel(this.speed, this.x, this.y, tx, ty)[0];
				}else if(( Math.abs(parseInt(this.x)-tx) <= 1) ){
					this.vx = 0;
				}
				//console.log("X: " + Math.abs(parseInt(this.x)-tx) + " " + ( Math.abs(parseInt(this.x)-tx) <= 2 ) );
				if(this.y < ty){
					//this.vy = this.speed;
					this.vy=getVel(this.speed, this.x, this.y, tx, ty)[1];
				}else if(this.y > ty){
					//this.vy = -this.speed;
					this.vy=-getVel(this.speed, this.x, this.y, tx, ty)[1];
				}else if(( Math.abs(parseInt(this.y)-ty) <= 1) ){
					this.vy = 0;
					//console.log("Y: " + Math.abs(parseInt(this.y)-ty) );
				}
				//console.log("Y: " + Math.abs(parseInt(this.y)-ty) + " " + ( Math.abs(parseInt(this.y)-ty) <= 2 ) );
				
				if(( Math.abs(parseInt(this.y)-ty) <= 2) && ( Math.abs(parseInt(this.x)-tx) <= 2)){
					this.currentPatrolArea++;
					//console.log("ADDING");
				}
			}else{
				this.currentPatrolArea = 0;
			}
			
			this.x+=this.vx;
			this.y+=this.vy;
		}else{
			
			this.x = this.parentedTo.x+this.startX;
			this.y = this.parentedTo.y+this.startY;
			
		}
		var collisions = this.collision();
		for(k=0; k<collisions.length; k++){
			this.interact(collisions[k]);
		}
		
	}
	
	this.render = function(){
		var rect = {x: 0, y: 0, w: canvas.width, h: canvas.height};
		if (this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.y + this.h > rect.y) {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
		}
	}
	
}

/* This is the object I use to render the name of the level when it starts. You can use it for other things too, but it lacks the polish of the other objects. */
var Text = function(){
	this.inGame = true;
	this.x = 0;
	this.y = 0;
	
	this.vx = 0;
	this.vy = 0;
	
	this.w = 100;
	this.h = 10;
	
	this.txt = "EXAMPLE TEXT";
	
	this.color = "rgba(201, 201, 201, 1.0)";
	
	this.id = "text";
	this.font = "60px Verdana";
	
	this.speed = 0.2;
	
	this.patrolArea = [];
	
	this.parentedTo = null;
	
	this.bouncyThresh = 1.7;
	this.bouncyness = 5;
	
	this.currentPatrolArea = -1;
	this.update = function(){
		
	}
	
	this.render = function(){
		
		ctx.font = this.font;
		ctx.fillStyle = this.color;
		ctx.fillText(this.txt, this.x, this.y, this.w);
		
	}
	
}

/* Should be self explanitory. */
document.addEventListener("keydown", function(evt){
	if(!keysPressed.includes(evt.keyCode)){
		keysPressed.push(evt.keyCode);
	}
	//console.log(evt.keyCode);
});

/* Also self explanitory. */
document.addEventListener("keyup", function(evt){
	if(keysPressed.includes(evt.keyCode)){
		for(i=0; i<keysPressed.length; i++){
			if(keysPressed[i] == evt.keyCode){
				keysPressed.splice(i, 1);
				i--
			}
			if(i<0){
				i=0;
			}
		}
	}
});

/* The most crude rendering and updating function you will probably see today. But if it works, then don't fix it. */
var loopActual = setInterval(function(){
	render();
	update();
	timeTicks++;
}, 1);
