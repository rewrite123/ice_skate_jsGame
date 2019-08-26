
/*
  Here are all the level in 
  the game. Inside of the 
  get function is all the 
  stuff about the level that 
  we want. As you can see, 
  we frequently override 
  functions to make the 
  level what we want it to 
  be. This was by design of 
  course, because I didn't 
  feel like making an 
  interpretor just for my 
  game, so you will have to 
  stick the icky JavaScript 
  instead.
                            */


var pregame = function(){
	this.get = function(){
		this.elements = [];
		
		var exit;
		
		var player = new Player();
		player.startX = canvas.width/2-player.w/2;
		player.startY = canvas.height/2-player.h/2 - 400;
		player.x = canvas.width/2-player.w/2;
		player.y = canvas.height/2-player.h/2 - 400;
		player.speed = 0.01;
		this.elements.push(player);
		
		var txt1 = new Text();
		txt1.txt = "Welcome to iceskate!";
		txt1.x = 0;
		txt1.y = canvas.height/2-100;
		txt1.w = canvas.width;
		txt1.font = "120px Impact";
		txt1.a = 1.0;
		txt1.update = function(){
			if(txt1.a > 0){
				txt1.a -= 0.001;
			}else{
				txt1.inGame = false;
			}
			txt1.color = "rgba(255, 255, 255, " + txt1.a  + ")";
			
		}
		
		var txt2 = new Text();
		txt2.txt = "WASD to move";
		txt2.x = 0;
		txt2.y = canvas.height/2+100;
		txt2.w = canvas.width;
		txt2.font = "120px Impact";
		txt2.a = 1.0;
		txt2.update = function(){
			if(txt2.a > 0){
				txt2.a -= 0.001;
			}else{
				txt2.inGame = false;
			}
			txt2.color = "rgba(255, 255, 255, " + txt2.a + ")";
		}
		
		exit = new Powerup();
		exit.color = "rgb(0, 255, 0)";
		exit.w = 50;
		exit.h = 50;
		exit.x = canvas.width/2 - exit.w/2
		exit.y = 500;
		exit.interact = function(o){
			if(o.id == "player"){
				nextLevel();
			}
		}
		
		this.elements.push(txt1);
		this.elements.push(txt2);
		this.elements.push(exit);
		
		return this.elements;
	}
}
/* SUPER IMPORTANT! MAKE SURE THAT YOU ADD THE LEVEL OBJECT TO THE LEVELS ARRAY, AND THAT YOU ADD IT INT THE ORDER THAT YOU WANT THE LEVELS IN, OTHERWISE IT WONT BE IN THE GAME! Also helps in debugging and other stuff if you create an instance of the level. */
var pg = new pregame();
levels.push(pg);

var level1 = function(){
	
	this.get = function(){
		this.elements = [];
		
		var exit;
		
		var player = new Player();
		player.startX = 0;
		player.startY = 0;
		player.speed = 0.01;
		this.elements.push(player);
		
		var txt1 = new Text();
		txt1.txt = "SQUEEZE!";
		txt1.x = 0;
		txt1.y = canvas.height/2;
		txt1.w = canvas.width;
		txt1.font = "120px Impact";
		txt1.a = 1.0;
		txt1.update = function(){
			if(txt1.a > 0){
				txt1.a -= 0.001;
			}else{
				txt1.inGame = false;
			}
			txt1.color = "rgba(255, 255, 255, " + txt1.a  + ")";
			
		}
		
		var e1 = new Enemy();
		e1.x = 0;
		e1.y = 30;
		e1.w = canvas.width - 25;
		
		var e2 = new Enemy();
		e2.x = 25;
		e2.y = 70;
		e2.w = canvas.width - 25;
		//e2.patrolArea = [100, 100, 200, 200];
		//e2.currentPatrolArea = 0;
		
		e3 = new Enemy();
		e3.inGame = false;
		e3.x = 25;
		e3.y = 460;
		e3.w = canvas.width - 25;
		
		var e4 = new Enemy();
		e4.inGame = false;
		e4.x = 0;
		e4.y = 425;
		e4.w = canvas.width - 25;
		
		var p1 = new Powerup();
		p1.w = 50;
		p1.h = 50;
		p1.x = canvas.width/2 - p1.w/2;
		p1.y = 350;
		p1.interact = function(o){
			if(o.id == "player" || true){
				o.speed+=0.03;
				e3.inGame = true;
				e4.inGame = true;
				exit.inGame = true;
				
				txt1.txt = "TOO FAST?";
				txt1.color = "rgb(255, 0, 0)";
				txt1.a = 1.0;
				txt1.inGame = true;
				txt1.update = function(){
					if(txt1.a > 0){
						txt1.a -= 0.001;
					}else{
						txt1.inGame = false;
					}
					txt1.color = "rgba(255, 120, 120, " + txt1.a  + ")";
				}
				
			}
			for(k=0; k<elements.length; k++){
				if(elements[k] == this){
					elements.splice(k, 1);
					break;
				}
			}
			
		}
		//p1.patrolArea = [100, 100, 200, 200];
		
		exit = new Powerup();
		exit.inGame = false;
		exit.color = "rgb(225, 121, 102)";
		exit.w = 50;
		exit.h = 50;
		exit.x = canvas.width/2 - exit.w/2
		exit.y = 500;
		exit.interact = function(o){
			if(o.id == "player"){
				nextLevel();
			}
		}
		
		this.elements.push(txt1);
		this.elements.push(e1);
		this.elements.push(e2);
		this.elements.push(e3);
		this.elements.push(e4);
		this.elements.push(p1);
		this.elements.push(exit);
		
		return this.elements;
	}
	
}
var l1 = new level1();
levels.push(l1);

var level2 = function(){
	
	this.get = function(){
		this.elements = [];
		
		var exit = new Powerup();
		exit.color = "rgb(225, 121, 102)";
		exit.w = 50;
		exit.h = 50;
		exit.x = 0;
		exit.y = 400;
		exit.interact = function(o){
			if(o.id == "player"){
				nextLevel();
			}
		}
		exit.patrolArea = [0, 400, canvas.width-exit.w, 400];
		exit.currentPatrolArea = 0;
		
		var player = new Player();
		player.startX = 0;
		player.startY = 0;
		player.speed = 0.01;
		this.elements.push(player);
		
		
		var txt1 = new Text();
		txt1.txt = "THEY MOVE";
		txt1.x = 0;
		txt1.y = canvas.height/2;
		txt1.w = canvas.width;
		txt1.font = "120px Impact";
		txt1.a = 1.0;
		txt1.update = function(){
			if(txt1.a > 0){
				txt1.a -= 0.001;
			}else{
				txt1.inGame = false;
			}
			txt1.color = "rgba(255, 255, 255, " + txt1.a  + ")";
			
		}
		
		var e1 = new Enemy();
		e1.parentedTo = exit;
		e1.startX = -10;
		e1.startY = -10;
		e1.w = exit.w+20;
		e1.h = 10;
		
		var e2 = new Enemy();
		e2.parentedTo = exit;
		e2.startX = -10;
		e2.startY = 0;
		e2.w = 10;
		e2.h = exit.h+60;
		
		var e3 = new Enemy();
		e3.parentedTo = exit;
		e3.startX = exit.w;
		e3.startY = 0;
		e3.w = 10;
		e3.h = exit.h+100;
		
		var e4 = new Enemy();
		e4.parentedTo = exit;
		e4.startX = -10;
		e4.startY = exit.h+100;
		e4.w = exit.w+20;
		e4.h = 10;
		
		this.elements.push(txt1);
		this.elements.push(e1);
		this.elements.push(e2);
		this.elements.push(e3);
		this.elements.push(e4);
		this.elements.push(exit);
		
		return this.elements;
	}
	
}
var l2 = new level2();
levels.push(l2);

var level3 = function(){
	
	this.get = function(){
		this.elements = [];
		
		var exit = new Powerup();
		exit.color = "rgb(225, 121, 102)";
		exit.w = canvas.width;
		exit.h = 100;
		exit.x = 0;
		exit.y = -350*30;
		exit.vy = 1;
		exit.interact = function(o){
			if(o.id == "player"){
				nextLevel();
			}
		}
		
		var player = new Player();
		player.startX = canvas.width/2-player.w/2;
		player.startY = canvas.height/2-player.h/2;
		player.x = canvas.width/2-player.w/2;
		player.y = canvas.height/2-player.h/2;
		player.speed = 0.01;
		this.elements.push(player);
		
		var projectiles = [];
		for(k=0; k<300; k++){
			var tp = new Projectile()
			tp.y = -k*30 - 1000;
			tp.x = getRandomNumber(0, canvas.width-10);
			tp.w = 10;
			tp.h = 50;
			tp.vy = 1;
			tp.update = function(){
				this.x+=this.vx;
				this.y+=this.vy;
				var r = Math.floor(255*(Math.sin((this.x+timeTicks)/60)/2+0.5));
				var g = Math.floor(255*(Math.sin((this.x+timeTicks)/60-(Math.PI*4)/3)/2+0.5));
				var b = Math.floor(255*(Math.sin((this.x+timeTicks)/60-(Math.PI*2)/3)/2+0.5));
				this.color = "rgb(" + r + ", " + g + ", " + b + ")";
			}
			projectiles.push(tp);
		}
		
		var txt1 = new Text();
		txt1.txt = "PROJECTILES INCOMING!";
		txt1.x = 0;
		txt1.y = canvas.height/2;
		txt1.w = canvas.width;
		txt1.font = "120px Impact";
		txt1.a = 1.0;
		txt1.update = function(){
			if(txt1.a > 0){
				txt1.a -= 0.001;
			}else{
				txt1.inGame = false;
			}
			txt1.color = "rgba(255, 255, 255, " + txt1.a  + ")";
			
		}
		
		this.elements.push(txt1);
		for(k=0;k<projectiles.length; k++){
			this.elements.push(projectiles[k]);
		}
		this.elements.push(exit);
		
		return this.elements;
	}
	
}
var l3 = new level3();
levels.push(l3);


var level4 = function(){
	
	this.get = function(){
		this.elements = [];
		
		var exit = new Powerup();
		exit.color = "rgb(225, 121, 102)";
		exit.w = 50;
		exit.h = 50;
		exit.x = canvas.width/2-exit.w/2;
		exit.y = canvas.height/2-exit.h/2;
		exit.vy = 1;
		exit.interact = function(o){
			if(o.id == "player"){
				nextLevel();
			}
		}
		
		var player = new Player();
		player.startX = canvas.width/2-player.w/2;
		player.startY = canvas.height/2-player.h/2 - 100;
		player.x = canvas.width/2-player.w/2;
		player.y = canvas.height/2-player.h/2 - 100;
		player.speed = 0.01;
		this.elements.push(player);
		
		
		var txt1 = new Text();
		txt1.txt = "R";
		txt1.x = 0;
		txt1.y = canvas.height/2;
		txt1.w = canvas.width;
		txt1.font = "120px Impact";
		txt1.a = 1.0;
		txt1.update = function(){
			if(txt1.a > 0){
				txt1.a -= 0.001;
			}else{
				txt1.inGame = false;
			}
			txt1.color = "rgba(255, 255, 255, " + txt1.a  + ")";
			
		}
		
		this.elements.push(txt1);
		this.elements.push(exit);
		
		return this.elements;
	}
	
}
var l4 = new level4();
levels.push(l4);

elements = levels[currentLevel].get();