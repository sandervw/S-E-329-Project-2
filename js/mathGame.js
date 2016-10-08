//Function to Start the Math Game
function start_MathGame(){
	//  hide_Banner_And_Nav();
	$('#mainPage').hide();
	$('body').css({height: "100%"});
	$('html').css({height: "100%"});
	$("#game").show();
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating
	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();
	mathGame.init();

	new Audio('sounds/MathIsFun.mp3').play();
	
	console.log(mathGame);
	window.addEventListener('resize', mathGame.resize, false);
}

var mathGame = {
	WIDTH: 0,
	HEIGHT: 0,
	offset: {top: 0, left: 0},
	currentWidth: null,
	currentHeight: null,
	canvas: null,
	ctx: null,
	ua:  null,
	android: null,
	ios:  null,
	init: function(){
		
		mathGame.canvas = document.getElementsByTagName('canvas')[0];
		mathGame.menuBackground = new Image();
		mathGame.menuBackground.src = 'images/mathgamebackground.jpg';
		mathGame.mainMenu = new Menu(["Start Game","Main Menu"],[1, 2],375, 50, 400, 0)
		mathGame.state = 0;
		mathGame.shouldRender = 0;
		mathGame.shouldUpdate = 1;
		mathGame.WIDTH = $(window).width();
		mathGame.HEIGHT = $(window).height();
		mathGame.canvas.width = mathGame.WIDTH;
		mathGame.canvas.height = mathGame.HEIGHT;
		mathGame.currentHeight = mathGame.HEIGHT;
		mathGame.currentWidth = mathGame.WIDTH;
		mathGame.ctx = mathGame.canvas.getContext('2d');
		mathGame.menuBackground.onload = function(){
			mathGame.ctx.drawImage(mathGame.menuBackground,0,0);  
			mathGame.mainMenu.Render();
		}
		
		mathGame.ua = navigator.userAgent.toLowerCase();
		mathGame.android = mathGame.ua.indexOf('android') > -1 ? true : false;
		mathGame.ios = ( mathGame.ua.indexOf('iphone') > -1 || mathGame.ua.indexOf('ipad') > -1  ) ? true : false;

		//Event Listeners, click and touch.
		window.addEventListener('click', function(e) {
			e.preventDefault();
			mathGame.shouldUpdate = 1;
			mathGame.Input.set(e);
		}, false);
		window.addEventListener('touchstart', function(e) {
			e.preventDefault();
			mathGame.shouldUpdate = 1;
			mathGame.Input.set(e.touches[0]);
		}, false);
		window.addEventListener('touchmove', function(e) {
			mathGame.shouldUpdate = 1;
			e.preventDefault();
		}, false);
		window.addEventListener('touchend', function(e) {
			mathGame.shouldUpdate = 1;
			e.preventDefault();
		}, false);
		InputManager.reset();
		mathGame.resize();
		mathGame.loop();
	},
		
	update: function() {
		mathGame.mainMenu.Update();
	},

	render: function() {
		mathGame.ctx.clearRect(0, 0, mathGame.WIDTH, mathGame.HEIGHT);
		mathGame.ctx.drawImage(mathGame.menuBackground,0,0); 
		mathGame.mainMenu.Render();
		
		mathGame.shouldRender = 0;
	},

	loop: function() {
		mathGame.update();
		if(mathGame.shouldRender) mathGame.render();
		requestAnimFrame(mathGame.loop);
	},

	resize: function(){
		if (mathGame.android || mathGame.ios) {
		document.body.style.height = (window.innerHeight + 50) + 'px';
		}
		mathGame.canvas.style.width = mathGame.currentWidth + 'px';
		mathGame.canvas.style.height = mathGame.currentHeight + 'px';
		mathGame.offset.top = mathGame.canvas.offsetTop;
		mathGame.offset.left = mathGame.canvas.offsetLeft;
		window.setTimeout(function() {
			window.scrollTo(0,1);
		}, 1);
	}
}

mathGame.Draw = {
	clear: function() {
		mathGame.ctx.clearRect(0, 0, mathGame.WIDTH, mathGame.HEIGHT);
	},
	rect: function(x, y, w, h, col) {
		mathGame.ctx.fillStyle = col;
		mathGame.ctx.fillRect(x, y, w, h);
	},
	circle: function(x, y, r, col) {
		mathGame.ctx.fillStyle = col;
		mathGame.ctx.beginPath();
		mathGame.ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
		mathGame.ctx.closePath();
		mathGame.ctx.fill();
	},
	text: function(string, x, y, size, col) {
		mathGame.ctx.font = 'bold '+size+'px Monospace';
		mathGame.ctx.fillStyle = col;
		mathGame.ctx.fillText(string, x, y);
	}
};

mathGame.Input = {
	x: 0,
	y: 0,
	tapped :false,
	set: function(data) {
		this.x = (data.pageX - mathGame.offset.left);
		this.y = (data.pageY - mathGame.offset.top);
		this.tapped = true;
		mathGame.Draw.text(this.x + " " + this.y, this.x, this.y, 10, 'red');
	}
};

Menu = function (items, operations, y, fontSize, width, selected){
	
	this.items = items;
	this.operations = operations;
	this.y = y;
	this.fontSize = fontSize;
	this.width = width;
	this.selected = selected;
	
}

Menu.prototype.constructor = Menu;

Menu.prototype.Render = function()
{
	/*if (this.backgroundCallback)
		this.backgroundCallback(elapsed);
	else
	{
		var lingrad = ctx.createLinearGradient(0,0,0,canvas.height);
		lingrad.addColorStop(0, '#000');
		lingrad.addColorStop(1, '#023');
		ctx.fillStyle = lingrad;
		ctx.fillRect(0,0,canvas.width, canvas.height);
	}*/
	
	mathGame.ctx.textAlign = "center";
	mathGame.ctx.fillStyle = "White";

	var y = this.y;

	for (var i = 0; i < this.items.length; ++i)
	{
		var size = Math.floor(this.fontSize*0.8);
		if (i == this.selected)
		{
			mathGame.ctx.fillStyle = "Green";
			size = this.fontSize;
		}
		mathGame.ctx.font = "arcadeClassic";
		y += this.fontSize;
		mathGame.ctx.fillText(this.items[i], mathGame.WIDTH/2, y);
		mathGame.ctx.fillStyle = "White";
	}
}

Menu.prototype.Update = function()
{
	InputManager.padUpdate();
	console.log(InputManager.lastMouseX);
	
	var prevSelected = this.selectedItem;
	if (InputManager.padPressed & InputManager.PAD.UP)
		this.selected = (this.selected + this.items.length - 1) % this.items.length;
		mathGame.shouldRender = 1;
	if (InputManager.padPressed & InputManager.PAD.DOWN)
		this.selected = (this.selected + 1) % this.items.length;
		mathGame.shouldRender = 1;

	var leftx = (mathGame.canvas.width - this.width)/2;
	if (InputManager.lastMouseX >= leftx && InputManager.lastMouseX < leftx+this.width)
	{
		var y = this.y + this.size*0.2; // Adjust for baseline
		if (InputManager.lastMouseY >= y && InputManager.lastMouseY < (y + this.size*this.items.length))
			this.selected = Math.floor((InputManager.lastMouseY - y)/this.size);
			mathGame.shouldRender = 1;
	}
}

