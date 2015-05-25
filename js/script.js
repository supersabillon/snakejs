var Snake,
	gameCtx = null,
	w = 0,
	h = 0,
	speed,
	direction,
	size = 10,
	level,
	player,
	foodBin,
	segment = [],
	Food = function(){
		
		this.x = Math.floor(Math.random() * (w - size) / size);
		this.y = Math.floor(Math.random() * (h - size) / size);

		this.createFoods = function() {
			gameCtx.fillStyle = "#fff";
			gameCtx.fillRect(this.x * size, this.y * size, size, size);
		};
	};

Snake = {

	start : function() {
		direction = 'right';
		player = [];
		foodBin = [];
		speed = 500;
		level = 1;
		var length = 5;
		$('#level span').text(level);

		for (var i = length -1; i >=0; i--) {
			player.push({x: i, y: 0});
		}
		
		foodBin.push(new Food());

		Snake.drawSnake();

	},

	drawSnake : function(){
		gameCtx.clearRect(0, 0, w, h);

		_.each(player, function (body) {
			gameCtx.fillStyle = "#000";
			gameCtx.fillRect(body.x * size, body.y * size, size, size);
		});

		_.each(foodBin, function (food) {
			food.createFoods();
		});

		setTimeout(Snake.update, speed);
	},

	update : function(){
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
		};

		Snake.checkCollision(newXposition, newYposition);
		
	},
	checkCollision : function(x, y){
		var i, s;

		for(i = 1; i < player.length; i++) {
			s = player[i];

			if(s.x == x && s.y == y) {
				return Snake.gameOver();
			}
		}

		//Check boundaries
		if(x == -1 || y == -1 || x >= w / size || y >= h / size) {
			return Snake.gameOver();
		}
		
		Snake.checkFood(x, y);

	},

	checkFood : function(x, y) {
		_.each(foodBin, function (food, i) {
			if (food.x == x && food.y == y) {
				
				//snake grows
				player.push({x: food.x, y: food.y});

				//eat food
				foodBin.splice(i, 1);


				//if snake has eaten all the foods
				if (foodBin.length === 0) {
					level++;

					speed *= 0.75;
					for (var j = 0; j < level; j++) {
						foodBin.push(new Food);
					}
					Snake.nextLevel(level);
				}

			}
		});

		Snake.moveSnake(x, y);
	},

	moveSnake : function(x, y) {
		var tail = player.pop();
		tail.x = x;
		tail.y = y;

		player.unshift(tail);

		Snake.drawSnake();
	},

	nextLevel : function(n) {
		$('#level span').text(n).animate({"font-size": "180%"}, 300, function() {
			$(this).animate({"font-size" : "24px"});
		});
	},

	gameOver : function(){
		$('#game-over').show();

	},


	init : function(){
		var doc = document,
			gameCanvas = doc.getElementById("game");
			gameCtx = gameCanvas.getContext("2d");
			w = gameCanvas.width;
			h = gameCanvas.height;

		Snake.start();

		$('#help-info').on('click', function(){
			$('#help').show();
		});

		$('.close-pop').on('click', function() {
			$(this).parent().hide();
		});

		$('#game-over a').on('click', function() {
			Snake.start();
			$(this).parent().hide();
		});

		$(doc).keydown(function(e) {
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
	}
};


r(Snake.init);


function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f();}