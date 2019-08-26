/* Just returns the difference between two numbers. */
function diff(n1, n2){
	if(n1>n2){
		return n1-n2;
	}else{
		return n2-n1;
	}
}

/* Return a random number between the minimum and maximum gived as params.*/
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Some simple trig function that returns an array of two doubles that is the gived speed to a point given its starting point, its target point, and the objects desired total speed. */
function getVel(speed, p1x, p1y, p2x, p2y){
	
	var dx = diff(p1x, p2x);
	var dy = diff(p1y, p2y);
	
	var angle = Math.atan(dy/dx);
	
	var answer = [Math.cos(angle)*speed, Math.sin(angle)*speed];
	return answer;
}

/* Just animates the body background to change colors when the player dies. */
function playDeath(){
	
	var color = 51;
	var color2 = 81;
	
	document.body.style.background = "rgb(" + color + ", " + color + ", " + color2 + ")";
	
	var tanim = setInterval(function(e){
		
		document.body.style.background = "rgb(" + color + ", " + color + ", " + color2 + ")";
		
		if(color <= 0 && color2 <= 0){
			clearInterval(tanim);
		}
		if(color > 0){
			color-=1;
		}
		if(color2 > 0){
			color2-=1;
		}
		
	}, 1);
	
}