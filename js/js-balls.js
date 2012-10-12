/* Collision detection from Keith Peters, 'AS3: Making Things Move' */
var Bouncy = {};
Bouncy.bounce = -1.0; //friction
//boundries, set in script
Bouncy.boundries = {
    left: undefined,
    right: undefined,
    top: undefined,
    bottom: undefined
};
//check collision against boundries
Bouncy.check_walls = function (ball) {
    if (ball.x + ball.radius > Bouncy.boundries.right) {
        ball.modify({ x: Bouncy.boundries.right - ball.radius,
            vx: ball.vx * Bouncy.bounce
        });
    } else if (ball.x - ball.radius < Bouncy.boundries.left) {
        ball.modify({ x: Bouncy.boundries.left + ball.radius,
            vx: ball.vx * Bouncy.bounce
        });
    }
    if (ball.y + ball.radius > Bouncy.boundries.bottom) {
        ball.modify({ y: Bouncy.boundries.bottom - ball.radius,
            vy: ball.vy * Bouncy.bounce
        });
    } else if (ball.y - ball.radius < Bouncy.boundries.top) {
        ball.modify({ y: Bouncy.boundries.top + ball.radius,
            vy: ball.vy * Bouncy.bounce
        });
    }
};
Bouncy.rotate = function (x, y, sin, cos, reverse) {
    var point = {};
    if (reverse) {
        point.x = x * cos + y * sin;
        point.y = y * cos - x * sin;
    } else {
        point.x = x * cos - y * sin;
        point.y = y * cos + x * sin;
    }
    return point;
};
Bouncy.check_collision = function (ball_a, ball_b) {
    //calculate distance
    var dx = ball_b.x - ball_a.x;
    var dy = ball_b.y - ball_a.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    //it's a hit!
    if (dist < ball_a.radius + ball_b.radius) {
        var angle = Math.atan2(dy, dx);
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        //rotate position
        var pos_a = { x: 0, y: 0 };
        var pos_b = Bouncy.rotate(dx, dy, sin, cos, true);
        //rotate velocity
        var vel_a = Bouncy.rotate(ball_a.vx, ball_a.vy, sin, cos, true);
        var vel_b = Bouncy.rotate(ball_b.vx, ball_b.vy, sin, cos, true);
        //collision reaction
        var vx_total = vel_a.x - vel_b.x;
        vel_a.x = ((ball_a.mass - ball_b.mass) * vel_a.x + 2 * ball_b.mass * vel_b.x) /
                      (ball_a.mass + ball_b.mass);
        vel_b.x = vx_total + vel_a.x;
        //update position
        var abs_v = Math.abs(vel_a.x) + Math.abs(vel_b.x);
        var overlap = (ball_a.radius + ball_b.radius) - Math.abs(pos_a.x - pos_b.x);
        pos_a.x += vel_a.x / abs_v * overlap;
        pos_b.y += vel_b.x / abs_v * overlap;
        //rotate back
        var pos_aF = Bouncy.rotate(pos_a.x, pos_a.y, sin, cos, false);
        var pos_bF = Bouncy.rotate(pos_b.x, pos_b.y, sin, cos, false);
        //adjust positions to screen
        ball_b.modify({ x: ball_a.x + pos_bF.x, y: ball_a.y + pos_bF.y });
        ball_a.modify({ x: ball_a.x + pos_aF.x, y: ball_a.y + pos_aF.y });
        //rotate velocities back
        var vel_aF = Bouncy.rotate(vel_a.x, vel_a.y, sin, cos, false);
        var vel_bF = Bouncy.rotate(vel_b.x, vel_b.y, sin, cos, false);
        ball_a.vx = vel_aF.x;
        ball_a.vy = vel_aF.y;
        ball_b.vx = vel_bF.x;
        ball_b.vy = vel_bF.y;
    }
};

function InitCanvasBalls() {
		//Mod by calderonsteven/pacopistolas
		(function(oo) {			
			oo.canvas('#BallsCanvas').clear();
 
			//generate a random color
			var random_color = function () {
				var color = (0xffffff * Math.random()).toString(16);
				return "#" + color.replace(/\./i,"").slice(0,6);
			};
			
			Bouncy.boundries = {
				left: 0,
				right: oo.canvas().width,
				top: 0,
				bottom: oo.canvas().height,
			};
			
			var balls = [];
			var numballs = 20;
            var valRadius = 10;
             
			for(var i = 0; i < numballs; i++) {
				var radius = Math.random() * valRadius + valRadius;
				var ball = oo.circle({x: i * 100,
									  y: i * 50,
									  radius:radius,
									  vx: Math.random() * 10 - 5,
									  vy: Math.random() * 10 - 5,
									  mass:radius,
									  fill:random_color()});					
				balls.push(ball);
			}
			
			oo.animate(function() {
				oo.canvas('#BallsCanvas').bgcolor(random_color());
				
				//check wall collision
				for(var i = 0; i < numballs; i++) {
					var ball = balls[i];
					var radius = Math.random() * valRadius + valRadius;
					
					ball.modify({x: ball.x + ball.vx,
								 y: ball.y + ball.vy,
								 radius:radius,
								 fill:random_color()});
								 
					Bouncy.check_walls(ball);
				}
				
				//check other ball collision
				for(i = 0; i < numballs - 1; i++) {
					var ball_a = balls[i];
					
					for(var j = i + 1; j < numballs; j++) {
						var ball_b = balls[j];
						Bouncy.check_collision(ball_a, ball_b);
					}
 
					balls[i].draw(); //and render
				}
				
			}, '64fps', true/*optional*/); //clears every frame by default
 
		})($doodle);
	};