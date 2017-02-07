/**
 * Licenced under MIT
 * Author HsuanWei Fu <hsuanweifu@gmail.com>
 */

'use strict';

if (SimpleCanvas === undefined) {
	var SimpleCanvas = {};
}

// initialize smoke particle array
if (SimpleCanvas.smokeParticles === undefined) {
	SimpleCanvas.smokeParticles = [];
}

/**
 * clear canvas
 * @param string canvasId canvas ids
 */
SimpleCanvas.clear = function(canvasId) {
	// sanity check
	if (canvasId === undefined || typeof canvasId !== 'string') {
		console.log('clear: sanity check failed');
		return;
	}
	
	// get canvas
	var canvas = document.getElementById(canvasId);
	if (canvas === null) {
		console.log('clear: canvas id does not exist');
		return;
	}
	
	canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * draw circle
 * @param object ctx canvas context
 * @param integer x x-coordinate of the center of the circle
 * @param integer y y-coordinate of the center of the circle
 * @param integer r radius of the circle
 * @param string color color of the circle
 */
SimpleCanvas.drawCircle = function(ctx, x, y, r, color){
	// sanity check
	if (ctx 	=== undefined || typeof ctx 	!== 'object' ||
		x 		=== undefined || typeof x 		!== 'number' ||
		y		=== undefined || typeof y 		!== 'number' ||
		r 		=== undefined || typeof r		!== 'number' ||
		color	=== undefined || typeof color	!== 'string') {
		
		console.log('drawCircle: sanity check failed');
		return;
	}
	
	ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.fillStyle = color;
    ctx.fill();
}

/**
 * draw smoke
 * @param string canvasId canvas id
 * @param integer x x-coordinate of the smoke origin
 * @param integer y y-coordinate of the smoke origin
 * @param integer particlesPerDeciSec number of particles per 0.1 second
 * @param integer riseSlope the angle of rise to horizontal particle displacement without windDirection
 * @param integer riseRate the rate of the rising smoke
 * @param string windDirection direction of the windDirection
 * @param integer windSpeed speed of the wind
 * @param number precision accuracy of the rates in the parameter to create realistic effects
 */
SimpleCanvas.drawSmoke = function(canvasId, x, y, particlesPerDeciSec, riseSlope, riseRate, windDirection = 'left', windSpeed = 0, precision = 0.8){
	// sanity check
	if (canvasId 			=== undefined || typeof canvasId 			!== 'string' ||
		x 					=== undefined || typeof x 					!== 'number' ||
		y 					=== undefined || typeof y 					!== 'number' ||
		particlesPerDeciSec === undefined || typeof particlesPerDeciSec !== 'number' ||
		riseSlope 			=== undefined || typeof riseSlope 			!== 'number' ||
		riseRate 			=== undefined || typeof riseRate 			!== 'number' ||
		windDirection 		=== undefined || typeof windDirection 		!== 'string' ||
		windSpeed			=== undefined || typeof windSpeed			!== 'number' ||
		precision			=== undefined || typeof precision			!== 'number') {
		console.log('drawSmoke: sanity check failed');
		return;
	}
	
	// get canvas
	var canvas = document.getElementById(canvasId);
	if (canvas === null) {
		console.log('clear: canvas id does not exist');
		return;
	}
	var ctx = canvas.getContext("2d");
	
	// remove out of bound particles
	for (var i = 0; i < SimpleCanvas.smokeParticles.length; i++) {
		if (SimpleCanvas.smokeParticles[i] === null) {
			continue;
		}
		if (SimpleCanvas.smokeParticles[i].x < 0 || SimpleCanvas.smokeParticles[i].x > canvas.width || SimpleCanvas.smokeParticles[i].y < 0) {
			SimpleCanvas.smokeParticles[i] = null;
		}
	}
	
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	// create particles
	var particles = [];
	for (var i = 0; i < particlesPerDeciSec; i++) {
		var particle = {
			x 		: x,
			y 		: y,
			color 	: '#' + componentToHex(Math.floor(Math.random() * 256)) + componentToHex(Math.floor(Math.random() * 256)) + componentToHex(Math.floor(Math.random() * 256)),
		}
		particles[i] = particle;
	}	
	
	// move particles
	for (var i = 0; i < SimpleCanvas.smokeParticles.length; i++) {
		if (SimpleCanvas.smokeParticles[i] === null) {
			continue;
		}
		
		var dx = riseRate / riseSlope * (1 - Math.floor(Math.random() * (100 - precision * 100)) / 100 );
		var dy = riseRate * (1 - Math.floor(Math.random() * (100 - precision * 100)) / 100 );
				
		if (Math.floor(Math.random() * 2) % 2 === 0) {
			dx = dx * (-1);
		}
		
		if (windDirection === 'left') {
			dx -= windSpeed;
		} else {
			dx += windSpeed;
		}
		
		SimpleCanvas.smokeParticles[i].x += dx;
		SimpleCanvas.smokeParticles[i].y -= dy;
	}
	
	// insert particles
	particles.forEach(function (particle) {
		var position = SimpleCanvas.smokeParticles.indexOf(null);
		if (position === -1) {
			SimpleCanvas.smokeParticles.push(particle);
		} else {
			SimpleCanvas.smokeParticles[position] = particle;
		}
	});
	
	// draw smoke
	SimpleCanvas.smokeParticles.forEach(function (particle) {
		if (particle === null) {
			return;
		}
		SimpleCanvas.drawCircle(ctx, particle.x, particle.y, 5, particle.color);
	});
}

/**
 * draw window
 * @param string canvasId canvas id
 * @param integer x x-coordinate of the window
 * @param integer y y-coordinate of the window
 * @param integer width width of the window
 * @param integer height height of the window
 * @param string panelColor color of the window panel
 * @param string frameColor color of the window frame
 */
SimpleCanvas.drawWindow = function(canvasId, x, y, width, height, panelColor, frameColor){
	// sanity check
	if (canvasId 			=== undefined || typeof canvasId 			!== 'string' ||
		x 					=== undefined || typeof x 					!== 'number' ||
		y 					=== undefined || typeof y 					!== 'number' ||
		width				=== undefined || typeof width				!== 'number' ||
		height	 			=== undefined || typeof height	 			!== 'number' ||
		panelColor 			=== undefined || typeof panelColor 			!== 'string' ||
		frameColor 			=== undefined || typeof frameColor	 		!== 'string') {
		console.log('drawWindow: sanity check failed');
		return;
	}
	
	var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    
    //Right window.
    ctx.rect(x, y, width, height);

    ctx.fillStyle = panelColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = frameColor;
    ctx.stroke();    
}

/**
 * draw door
 * @param string canvasId canvas id
 * @param integer x x-coordinate of the door
 * @param integer y y-coordinate of the door
 * @param integer width width of the door
 * @param integer height height of the door
 * @param string doorColor color of the door panel
 * @param string frameColor color of the door frame
 * @param string knobColor color of the door knob
 */
SimpleCanvas.drawDoor = function(canvasId, x, y, width, height, panelColor, frameColor, knobColor){
	// sanity check
	if (canvasId 			=== undefined || typeof canvasId 			!== 'string' ||
		x 					=== undefined || typeof x 					!== 'number' ||
		y 					=== undefined || typeof y 					!== 'number' ||
		width				=== undefined || typeof width				!== 'number' ||
		height	 			=== undefined || typeof height	 			!== 'number' ||
		panelColor 			=== undefined || typeof panelColor 			!== 'string' ||
		frameColor 			=== undefined || typeof frameColor	 		!== 'string' ||
		knobColor 			=== undefined || typeof knobColor	 		!== 'string') {
		console.log('drawDoor: sanity check failed');
		return;
	}
	
	var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
    
    ctx.rect(x, y, width, height);

    ctx.fillStyle = panelColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = frameColor;
    ctx.stroke();
	
	SimpleCanvas.drawCircle(ctx, x + width / 5, y + height / 2, width / 10, knobColor);
}

/**
 * draw chimney
 * @param string canvasId canvas id
 * @param integer x x-coordinate of the door
 * @param integer y y-coordinate of the door
 * @param integer width width of the door
 * @param integer height height of the door
 * @param string primary primary color of the chimney
 * @param string secondary secondary color of the chimney
 */
SimpleCanvas.drawChimney = function(canvasId, x, y, width, height, primary, secondary) {
	// sanity check
	if (canvasId 			=== undefined || typeof canvasId 			!== 'string' ||
		x 					=== undefined || typeof x 					!== 'number' ||
		y 					=== undefined || typeof y 					!== 'number' ||
		width				=== undefined || typeof width				!== 'number' ||
		height	 			=== undefined || typeof height	 			!== 'number' ||
		primary 			=== undefined || typeof primary 			!== 'string' ||
		secondary 			=== undefined || typeof secondary	 		!== 'string') {
		console.log('drawChimney: sanity check failed');
		return;
	}
	
	var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

	// TODO need to make the chimney prettier
    ctx.beginPath();
	
	ctx.rect(x, y, width, height);
	
    ctx.fillStyle = primary;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = secondary;
    ctx.stroke(); 
}

/**
 * draw wall
 * @param string canvasId canvas id
 * @param integer x x-coordinate of the door
 * @param integer y y-coordinate of the door
 * @param integer width width of the door
 * @param integer height height of the door
 * @param string primary primary color of the chimney
 * @param string secondary secondary color of the chimney
 */
SimpleCanvas.drawWall = function(canvasId, x, y, width, height, primary, secondary) {
	// sanity check
	if (canvasId 			=== undefined || typeof canvasId 			!== 'string' ||
		x 					=== undefined || typeof x 					!== 'number' ||
		y 					=== undefined || typeof y 					!== 'number' ||
		width				=== undefined || typeof width				!== 'number' ||
		height	 			=== undefined || typeof height	 			!== 'number' ||
		primary 			=== undefined || typeof primary 			!== 'string' ||
		secondary 			=== undefined || typeof secondary	 		!== 'string') {
		console.log('drawWall: sanity check failed');
		return;
	}
	
	var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
	
	ctx.rect(x, y, width, height);
	
    ctx.fillStyle = primary;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = secondary;
    ctx.stroke(); 
}

/**
 * draw roof
 * @param string canvasId canvas id
 * @param integer x x-coordinate of the door
 * @param integer y y-coordinate of the door
 * @param integer width width of the door
 * @param integer height height of the door
 * @param string primary primary color of the chimney
 * @param string secondary secondary color of the chimney
 */
SimpleCanvas.drawRoof = function(canvasId, x, y, width, height, primary, secondary) {
	// sanity check
	if (canvasId 			=== undefined || typeof canvasId 			!== 'string' ||
		x 					=== undefined || typeof x 					!== 'number' ||
		y 					=== undefined || typeof y 					!== 'number' ||
		width				=== undefined || typeof width				!== 'number' ||
		height	 			=== undefined || typeof height	 			!== 'number' ||
		primary 			=== undefined || typeof primary 			!== 'string' ||
		secondary 			=== undefined || typeof secondary	 		!== 'string') {
		console.log('drawRoof: sanity check failed');
		return;
	}
	
	var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext('2d');

    ctx.beginPath();
	
	ctx.rect(x, y, width, height);
	
    ctx.fillStyle = primary;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = secondary;
    ctx.stroke(); 
}