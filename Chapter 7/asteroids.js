$(document).ready(function() {	
	var canvas = $("#myCanvas");
	var context = canvas.get(0).getContext("2d");
	
	var canvasWidth = canvas.width();
	var canvasHeight = canvas.height();
	
	$(window).resize(resizeCanvas);
	
	function resizeCanvas() {
		canvas.attr("width", $(window).get(0).innerWidth);
		canvas.attr("height", $(window).get(0).innerHeight);
		
		canvasWidth = canvas.width();
		canvasHeight = canvas.height();
	};
	
	resizeCanvas();
	
	var playAnimation = true;
	
	var startButton = $("#startAnimation");
	var stopButton = $("#stopAnimation");
	
	startButton.hide();
	startButton.click(function() {
		$(this).hide();
		stopButton.show();
		
		playAnimation = true;
		animate();
	});
	
	stopButton.click(function() {
		$(this).hide();
		startButton.show();
		
		playAnimation = false;
	});
	
	// Class that defines new asteroids to draw
	var Asteroid = function(x, y, radius, mass, vX, vY, aX, aY) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.mass = mass;
		
		this.vX = vX;
		this.vY = vY;
		this.aX = aX;
		this.aY = aY;
	};
	
	// Array that holds all the asteroids to draw
	var asteroids = new Array();
	
	// Setting up some asteroids
	for (var i = 0; i < 10; i++) {
		var x = 20+(Math.random()*(canvasWidth-40));
		var y = 20+(Math.random()*(canvasHeight-40));
		
		var radius = 5+Math.random()*10;
		var mass = radius/2;
		
		var vX = Math.random()*4-2;
		var vY = Math.random()*4-2;
		//var aX = Math.random()*0.2-0.1;
		//var aY = Math.random()*0.2-0.1;
		var aX = 0;
		var aY = 0;
		
		asteroids.push(new Asteroid(x, y, radius, mass, vX, vY, aX, aY));
	};
	
	// Animation loop that does all the fun stuff
	function animate() {					
		// Clear
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		
		context.fillStyle = "rgb(255, 255, 255)";
		
		// Loop through every asteroid
		var asteroidsLength = asteroids.length;
		for (var i = 0; i < asteroidsLength; i++) {
			var tmpAsteroid = asteroids[i];
			
			for (var j = i+1; j < asteroidsLength; j++) {
				var tmpAsteroidB = asteroids[j];
				
				var dX = tmpAsteroidB.x - tmpAsteroid.x;
				var dY = tmpAsteroidB.y - tmpAsteroid.y;
				var distance = Math.sqrt((dX*dX)+(dY*dY));
				
				if (distance < tmpAsteroid.radius + tmpAsteroidB.radius) {								
					var angle = Math.atan2(dY, dX);
					var sine = Math.sin(angle);
					var cosine = Math.cos(angle);
					
					// Rotate asteroid position
					var x = 0;
					var y = 0;
					
					// Rotate asteroidB position
					var xB = dX * cosine + dY * sine;
					var yB = dY * cosine - dX * sine;
						
					// Rotate asteroid velocity
					var vX = tmpAsteroid.vX * cosine + tmpAsteroid.vY * sine;
					var vY = tmpAsteroid.vY * cosine - tmpAsteroid.vX * sine;
					
					// Rotate asteroidB velocity
					var vXb = tmpAsteroidB.vX * cosine + tmpAsteroidB.vY * sine;
					var vYb = tmpAsteroidB.vY * cosine - tmpAsteroidB.vX * sine;
					
					// Reverse the velocities
					//vX *= -1;
					//vXb *= -1;
					var vTotal = vX - vXb;
					vX = ((tmpAsteroid.mass - tmpAsteroidB.mass) * vX + 2 * tmpAsteroidB.mass * vXb) / (tmpAsteroid.mass + tmpAsteroidB.mass);
					vXb = vTotal + vX;
					
					// Move asteroids apart
					xB = x + (tmpAsteroid.radius + tmpAsteroidB.radius);
					
					// Rotate asteroid positions back
					tmpAsteroid.x = tmpAsteroid.x + (x * cosine - y * sine);
					tmpAsteroid.y = tmpAsteroid.y + (y * cosine + x * sine);
					
					tmpAsteroidB.x = tmpAsteroid.x + (xB * cosine - yB * sine);
					tmpAsteroidB.y = tmpAsteroid.y + (yB * cosine + xB * sine);
					
					// Rotate asteroid velocities back
					tmpAsteroid.vX = vX * cosine - vY * sine;
					tmpAsteroid.vY = vY * cosine + vX * sine;
					
					tmpAsteroidB.vX = vXb * cosine - vYb * sine;
					tmpAsteroidB.vY = vYb * cosine + vXb * sine;
				};
			};
			
			// Calculate velocity based on pixels-per-frame
			tmpAsteroid.x += tmpAsteroid.vX;
			tmpAsteroid.y += tmpAsteroid.vY;
			
			// Add acceleration to velocity
			if (Math.abs(tmpAsteroid.vX) < 10) {
				tmpAsteroid.vX += tmpAsteroid.aX;
			};
			
			if (Math.abs(tmpAsteroid.vY) < 10) {
				tmpAsteroid.vY += tmpAsteroid.aY;
			};
			
			/*
			// Friction
			if (Math.abs(tmpAsteroid.vX) > 0.1) {
				tmpAsteroid.vX *= 0.9;
			} else {
				tmpAsteroid.vX = 0;
			};
			
			if (Math.abs(tmpAsteroid.vY) > 0.1) {
				tmpAsteroid.vY *= 0.9;
			} else {
				tmpAsteroid.vY = 0;
			};
			*/
			
			// Boundary collision checks
			if (tmpAsteroid.x-tmpAsteroid.radius < 0) {
				tmpAsteroid.x = tmpAsteroid.radius; // Move away from the edge
				tmpAsteroid.vX *= -1;
				tmpAsteroid.aX *= -1;
			} else if (tmpAsteroid.x+tmpAsteroid.radius > canvasWidth) {
				tmpAsteroid.x = canvasWidth-tmpAsteroid.radius; // Move away from the edge
				tmpAsteroid.vX *= -1;
				tmpAsteroid.aX *= -1;
			};
			
			if (tmpAsteroid.y-tmpAsteroid.radius < 0) {
				tmpAsteroid.y = tmpAsteroid.radius; // Move away from the edge
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1;
			} else if (tmpAsteroid.y+tmpAsteroid.radius > canvasHeight) {
				tmpAsteroid.y = canvasHeight-tmpAsteroid.radius; // Move away from the edge
				tmpAsteroid.vY *= -1;
				tmpAsteroid.aY *= -1;
			};
			
			context.beginPath();
			context.arc(tmpAsteroid.x, tmpAsteroid.y, tmpAsteroid.radius, 0, Math.PI*2);
			context.closePath();
			context.fill();
		};
		
		if (playAnimation) {
			// Run the animation loop again in 33 milliseconds
			setTimeout(animate, 33);
		};
	};
	
	// Start the animation loop
	animate();
});
