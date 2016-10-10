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
		mathGame.highScore = 0;
		mathGame.menuAudio = new Audio('sounds/MathIsFun.mp3');
		mathGame.gameAudio = new Audio('sounds/MathGameBattleMusic.mp3');
		mathGame.menuAudio.play();
		mathGame.canvas = document.getElementsByTagName('canvas')[0];
		InputManager.connect(document, mathGame.canvas);
		mathGame.menuBackground = new Image();
		mathGame.menuBackground.src = 'images/mathgamebackground.jpg';
		mathGame.mainMenu = new Menu(["Start Game","Main Menu"],375, 50, 400, 0);
		mathGame.gameBackground = new Image();
		mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty1Stage1.png';
		mathGame.mainGame = new Game(0, 1, 0, 0, '+', 0);
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
		mathGame.gameBackground.onload = function(){
			mathGame.ctx.drawImage(mathGame.gameBackground,0,0, mathGame.gameBackground.width, mathGame.gameBackground.height, 0, 0, mathGame.WIDTH, mathGame.HEIGHT);  
			mathGame.mainGame.Render();
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
		if(mathGame.state == 0 || mathGame.state == 1 || mathGame.state == 3 || mathGame.state == 4) mathGame.mainMenu.Update();
		else if(mathGame.state == 2) mathGame.mainGame.Update();
	},

	render: function() {
		if(mathGame.state == 0 || mathGame.state == 1){
			mathGame.ctx.clearRect(0, 0, mathGame.WIDTH, mathGame.HEIGHT);
			mathGame.ctx.drawImage(mathGame.menuBackground,0,0, mathGame.menuBackground.width, mathGame.menuBackground.height, 0, 0, mathGame.WIDTH, mathGame.HEIGHT); 
			mathGame.mainMenu.Render();
			mathGame.shouldRender = 0;
		}
		else if(mathGame.state == 2){
			mathGame.ctx.clearRect(0, 0, mathGame.WIDTH, mathGame.HEIGHT);
			mathGame.ctx.drawImage(mathGame.gameBackground,0,0, mathGame.gameBackground.width, mathGame.gameBackground.height, 0, 0, mathGame.WIDTH, mathGame.HEIGHT); 
			mathGame.mainGame.Render();
			mathGame.shouldRender = 0;
		}
		else if(mathGame.state == 3 || mathGame.state == 4){
			mathGame.ctx.clearRect(0, 0, mathGame.WIDTH, mathGame.HEIGHT);
			mathGame.ctx.drawImage(mathGame.gameBackground,0,0, mathGame.gameBackground.width, mathGame.gameBackground.height, 0, 0, mathGame.WIDTH, mathGame.HEIGHT); 
			mathGame.mainMenu.Render();
			mathGame.shouldRender = 0;
		}
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
	}
};

Menu = function (items, y, fontSize, width, selected){
	
	this.items = items;
	this.y = y;
	this.fontSize = fontSize;
	this.width = width;
	this.selected = selected;
	
}

Menu.prototype.constructor = Menu;

Menu.prototype.Render = function()
{

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
		mathGame.ctx.font = size.toString() + "px arcadeClassic";
		y += this.fontSize;
		mathGame.ctx.fillText(this.items[i], mathGame.WIDTH/2, y);
		mathGame.ctx.fillStyle = "White";
	}
}

Menu.prototype.Update = function()
{
	InputManager.padUpdate();
	if (InputManager.padPressed & InputManager.PAD.OK)
	{
		setMenuState(this.selected);
		this.selected = 0;
		this.shouldRender = 1;
		return;
	}
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

function setMenuState(newState){
	if (mathGame.state == 0){
		if(newState == 0){
			mathGame.mainMenu.items = ['Easy', 'Medium', 'Hard', 'Back'];
			mathGame.state = 1;
		}
		else if(newState == 1){
			window.location.reload();
		}
	}
	else if (mathGame.state == 1){
		if(newState == 0){
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameAudio.play();
			mathGame.state = 2;
			mathGame.shouldRender = 1;
		}
		else if(newState == 1){
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameAudio.play();
			mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty2Stage1.png';
			mathGame.mainGame = new Game(0, 2, 0, 0, '+', 0);
			mathGame.state = 2;
			mathGame.shouldRender = 1;
		}
		else if(newState == 2){
			mathGame.menuAudio.pause();
			mathGame.menuAudio.currentTime = 0;
			mathGame.gameAudio.play();
			mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty3Stage1.png';
			mathGame.mainGame = new Game(0, 3, 0, 0, '+', 0);
			mathGame.state = 2;
			mathGame.shouldRender = 1;
		}
		else if(newState == 3){
			mathGame.mainMenu.items = ['Start Game', 'Main Menu'];
			mathGame.state = 0;
		}
	}
	else if (mathGame.state == 3){
		if(newState == 0){
			mathGame.gameAudio.pause();
			mathGame.gameAudio.currentTime = 0;
			mathGame.gameAudio.play();
			if(mathGame.mainGame.difficulty == 1){
				mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty1Stage1.png';
				mathGame.mainGame.message = 'Oh  no,  a  goblin  has  appeared!  Solve  the  problems  to  strike  it!';
			}
			else if(mathGame.mainGame.difficulty == 2){
				mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty2Stage1.png';
				mathGame.mainGame.message = 'Oh  no,  a  frost  giant  has  appeared!  Solve  the  problems  to  strike  it!';
			} 
			else if(mathGame.mainGame.difficulty == 3){
				mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty3Stage1.png';
				mathGame.mainGame.message = 'Oh  no,  a  dragon  has  appeared!  Solve  the  problems  to  strike  it!';
			}
			mathGame.mainGame.gameState = 0;
			mathGame.mainGame.monsterHP = 3;
			mathGame.mainGame.playerHP = 3;
			mathGame.state = 2;
			mathGame.shouldRender = 1;
		}
		else if(newState == 1){
			//submit high score;
		}
		else if(newState == 2){
			mathGame.gameAudio.pause();
			mathGame.gameAudio.currentTime = 0;
			mathGame.init();
		}
		else if(newState == 3){
			window.location.reload();
		}
	}
	else if (mathGame.state == 4){
		if(newState == 0){
			//submit high score;
		}
		else if(newState == 1){
			mathGame.gameAudio.pause();
			mathGame.gameAudio.currentTime = 0;
			mathGame.init();
		}
		else if(newState == 2){
			window.location.reload();
		}
	}
}

Game = function (gameState, difficulty, x, y, operation, answer){

	this.highScore = 0;
	this.gameState = gameState;
	this.playerHP = 3;
	this.monsterHP = 3;
	this.difficulty = difficulty;
	this.x = x;
	this.y = y;
	this.operation = operation;
	this.answer = answer;
	this.input = 'Hit  Space  to  Continue...';
	
	if(difficulty == 1){
		this.message = 'Oh  no,  a  goblin  has  appeared!  Solve  the  problems  to  strike  it!';
	}
	else if(difficulty == 2){
		this.message = 'Oh  no,  a  frost  giant  has  appeared!  Solve  the  problems  to  strike  it!';
	}
	else if(difficulty == 3){
		this.message = 'Oh  no,  a  dragon  has  appeared!  Solve  the  problems  to  strike  it!';
	}
	
}

Game.prototype.constructor = Game;

Game.prototype.Render = function(){
	
	mathGame.ctx.textAlign = "center";
	mathGame.ctx.fillStyle = "Black";
	
	mathGame.ctx.font = "40px arcadeClassic";
	
	if(this.gameState == 0){
		mathGame.ctx.fillText(this.message, mathGame.WIDTH/2, mathGame.HEIGHT-140);
		mathGame.ctx.fillStyle = "Green";
		mathGame.ctx.fillText(this.input, mathGame.WIDTH/2, mathGame.HEIGHT-70);
		mathGame.ctx.fillText('Player  HP:  ' + this.playerHP + '/3', 170, mathGame.HEIGHT-190);
		mathGame.ctx.fillText('Monster  HP:  ' + this.monsterHP + '/3', mathGame.WIDTH-170, mathGame.HEIGHT-190);
	}
	else{
		mathGame.ctx.fillText(this.message, mathGame.WIDTH/2, mathGame.HEIGHT-140);
		mathGame.ctx.fillStyle = "Green";
		mathGame.ctx.fillText(this.input, mathGame.WIDTH/2, mathGame.HEIGHT-70);
		mathGame.ctx.fillText('Player  HP:  ' + this.playerHP + '/3', 170, mathGame.HEIGHT-190);
		mathGame.ctx.fillText('Monster  HP:  ' + this.monsterHP + '/3', mathGame.WIDTH-170, mathGame.HEIGHT-190);
	}
	
}

Game.prototype.Update = function(){
	
	InputManager.padUpdate();
	if(this.gameState == 0 || this.gameState == 2){
		if (InputManager.padPressed & InputManager.PAD.OK){
			this.setNewEquation();
			this.gameState = 1;
			mathGame.shouldRender = 1;
		}
	}
	else if(this.gameState == 1){
		if(InputManager.padPressed & InputManager.PAD.NUMBER){
			this.input+= InputManager.number;
			mathGame.shouldRender = 1;
		}
		else if(InputManager.padPressed & InputManager.PAD.BACKSPACE){
			this.input = this.input.substring(0, this.input.length - 1);
			mathGame.shouldRender = 1;
		}
		else if(InputManager.padPressed & InputManager.PAD.OK){
			var temp = parseInt(this.input);
			if(temp == this.answer){
				this.monsterHP-=1;
				if(this.monsterHP == 2 && this.difficulty == 1){
					mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty1Stage2.png';
					this.message = 'The  monster  has  been  hurt.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 1 && this.difficulty == 1){
					mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty1Stage3.png';
					this.message = 'The  monster  has  been  severely  hurt.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 0 && this.difficulty == 1){
					mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty1Stage4.png';
					this.message = 'The  monster  has  been  slain.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 3;
					this.highScore += 10;
				}
				if(this.monsterHP == 2 && this.difficulty == 2){
					mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty2Stage2.png';
					this.message = 'The  monster  has  been  hurt.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 1 && this.difficulty == 2){
					mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty2Stage3.png';
					this.message = 'The  monster  has  been  severely  hurt.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 0 && this.difficulty == 2){
					mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty2Stage4.png';
					this.message = 'The  monster  has  been  slain.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 3;
					this.highScore += 30;
				}
				if(this.monsterHP == 2 && this.difficulty == 3){
					mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty3Stage2.png';
					this.message = 'The  monster  has  been  hurt.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 1 && this.difficulty == 3){
					mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty3Stage3.png';
					this.message = 'The  monster  has  been  severely  hurt.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				if(this.monsterHP == 0 && this.difficulty == 3){
					mathGame.gameBackground.src = 'images/mathGameFightScreens/Difficulty3Stage4.png';
					this.message = 'The  monster  has  been  slain.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 3;
					this.highScore += 50;
				}
			}
			else{
				this.playerHP-=1;
				if(this.playerHP>0){
					this.message = 'The monster has struck you. Do not surrender!';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 2;
				}
				else{
					this.message = 'You have been slain.';
					this.input = 'Hit  Space  to  Continue...';
					this.gameState = 3;
				}
			}
			mathGame.shouldRender = 1;
		}
	}
	else if(this.gameState == 3){
		if (InputManager.padPressed & InputManager.PAD.OK){
			if(this.playerHP > 0){
				mathGame.state = 3;
				mathGame.mainMenu.items = ['Continue Fighting', 'Submit High Score', 'Return to Main Menu', 'Exit Game'];
			}
			else{
				mathGame.state = 4;
				mathGame.mainMenu.items = ['Submit High Score', 'Return to Main Menu', 'Exit Game'];
			}
		}
	}
}

Game.prototype.setNewEquation = function(){
	
	if(this.difficulty == 1){
		this.x = Math.floor(Math.random() * 10);
		this.y = Math.floor(Math.random() * 10);
		var temp = Math.floor(Math.random() * 1);
		if(temp == 0){
			this.operation = '+';
			this.answer = this.x + this.y;
		}
		if(temp == 1){
			this.operation = '-';
			this.answer = this.x - this.y;
		}
		this.message = 'The  result  of  ' + this.x + '  ' + this.operation + '  ' + this.y + '  is:';
		this.input = '';
	}
	
	if(this.difficulty == 2){
		this.x = Math.floor(Math.random() * 10) + 5;
		this.y = Math.floor(Math.random() * 10) + 5;
		var temp = Math.floor(Math.random() * 3);
		if(temp == 0){
			this.operation = '+';
			this.answer = this.x + this.y;
		}
		if(temp == 1){
			this.operation = '-';
			this.answer = this.x - this.y;
		}
		if(temp == 2){
			this.operation = '*';
			this.answer = this.x * this.y;
		}
		if(temp == 3){
			this.operation = '/';
			this.answer = this.x;
			this.x = this.x * this.y;
		}
		this.message = 'The  result  of  ' + this.x + '  ' + this.operation + '  ' + this.y + '  is:';
		this.input = '';
	}
	
	if(this.difficulty == 3){
		this.x = Math.floor(Math.random() * 10) + 10;
		this.y = Math.floor(Math.random() * 10) + 10;
		var temp = Math.floor(Math.random() * 3);
		if(temp == 0){
			this.operation = '+';
			this.answer = this.x + this.y;
		}
		if(temp == 1){
			this.operation = '-';
			this.answer = this.x - this.y;
		}
		if(temp == 2){
			this.operation = '*';
			this.answer = this.x * this.y;
		}
		if(temp == 3){
			this.operation = '/';
			this.answer = this.x;
			this.x = this.x * this.y;
		}
		this.message = 'The  result  of  ' + this.x + '  ' + this.operation + '  ' + this.y + '  is:';
		this.input = '';
	}
	
}