var snake = (function($, d){
	"use strict";

	var gameCtx = null,
	w = 0,
	h = 0,
	direction = 'right',
	player = [],
	foodBin = [],
	speed = 400,
	size = 10,
	level= 1,
	Food = function(){
		
		this.x = Math.floor(Math.random() * (w - size) / size);
		this.y = Math.floor(Math.random() * (h - size) / size);

		this.createFoods = function() {
			gameCtx.fillStyle = "#fff";
			gameCtx.fillRect(this.x * size, this.y * size, size, size);
		};
	};

	//start game by drawing snake and
	//adding food to canvas
	var _start = function(){
		var length = 7,
		i;

		for(i = length -1; i >=0; i = i - 1) {
			player.push({x: i, y: 0});
		}
		
		foodBin.push(new Food());
		_drawSnake();
	};

	//reset values
	var _reset = function() {
		direction = 'right';
		player = [];
		foodBin = [];
		speed = 400;
		level = 1;
		$('#level span').text(level);
	};

	//draw snake in canvas
	var _drawSnake = function(){
		gameCtx.clearRect(0, 0, w, h);

		_.each(player, function (body) {
			gameCtx.fillStyle = "#000";
			gameCtx.fillRect(body.x * size, body.y * size, size, size);
		});

		_.each(foodBin, function (food) {
			food.createFoods();
		});

		setTimeout(_updateSnake, speed);
	};

	//update snake direction movement
	var _updateSnake = function(){
		var newXposition = player[0].x,
		newYposition = player[0].y;

		switch(direction) {
			case 'left':
				newXposition--;
				break;
			case 'right':
				newXposition++;
				break;
			case 'up':
				newYposition--;
				break;
			case 'down':
				newYposition++;
				break;
			default:
				newXposition++;
		}

		_checkCollision(newXposition, newYposition);
	};

	//check collision against boundaries and tail
	var _checkCollision = function(x, y) {
		var i, s;

		//check tail collision
		for(i = 1; i < player.length; i = i + 1) {
			s = player[i];

			if(s.x === x && s.y === y) {
				return _gameOver();
			}
		}

		//Check boundaries
		if(x === -1 || y === -1 || x >= w / size || y >= h / size) {
			return _gameOver();
		}
		
		_checkFood(x, y);
	};

	//check if food was eaten
	//grow snake and level up if completed
	var _checkFood = function(x, y) {
		_.each(foodBin, function (food, index) {
			if (food.x === x && food.y === y) {
				
				//snake grows
				player.push({x: food.x, y: food.y});

				//eat food
				foodBin.splice(index, 1);


				//if snake has eaten all the foods
				if (foodBin.length === 0) {
					level++;

					speed *= 0.75;
					var j;
					for (j = 0; j < level; j = j + 1) {
						foodBin.push(new Food);
					}
					_nextLevel(level);
				}

			}
		});

		_moveSnake(x, y);
	};


	//update level in the dom
	var _nextLevel = function(num) {
		$('#level span').text(num).animate({"font-size": "180%"}, 300, function() {
			$(this).animate({"font-size" : "24px"});
		});
	};


	//moves snake
	var _moveSnake = function(x, y) {
		var tail = player.pop();
		tail.x = x;
		tail.y = y;

		player.unshift(tail);

		_drawSnake();

	};

	//end game and reset
	var _gameOver = function(){
		$('#game-over').show();
		_reset();
	};

	//initialize event listeners
	var _initEvents = function(){

		$('#game-over a').on('click', function() {
			_start();
			$(this).parent().hide();
		});

		$('#start').on('click', function(e){
			_start();
			e.preventDefault();
			$(this).parent().hide();
		});



		$(d).keydown(function(e) {
			switch(e.which) {
				case 37:
					direction = direction != 'right' ? 'left' : 'right';
					break;
				case 38:
					direction = direction != 'down' ? 'up' : 'down';
					break;
				case 39:
					direction = direction != 'left' ? 'right' : 'left';
					break;
				case 40:
					direction = direction != 'up' ? 'down' :  'up';
					break;
				default:
				return; 
			}
			e.preventDefault();
		});
	};

	//initialize game
	var init = function(){
		var gameCanvas = d.getElementById("game");
		gameCtx = gameCanvas.getContext("2d");
		w = gameCanvas.width;
		h = gameCanvas.height;

		_initEvents();
	};


	return {
		init : init
	};

})(jQuery, document);