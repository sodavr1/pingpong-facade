const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// GAME GLOBALS VARS
const grid = 10;
const paddleHeight = grid * 4; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

var paddleSpeed = 9;
var ballSpeed = 1.5;
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var gameStarted = false;
const maxScore = 10;

// DRAWING CONTROLS 
const leftPaddle = {
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid,
    height: grid,
    backgroundColor: 'red',
    resetting: false,
    dx: ballSpeed,
    dy: -ballSpeed
};

// COLLIDING
function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

// SCORE DRAWING
function drawScores() {
    context.fillStyle = 'white';
    context.font = '12px Arial';
    context.fillText('Player 1: ' + leftPlayerScore, 45, 30);
    context.fillText('Player 2: ' + rightPlayerScore, canvas.width - 100, 30);
}

// SCORE CHECKING END GAME TRIGGERS  
function scoreCheck(rightPlayerScore, leftPlayerScore){
    console.log('score check called')
    if (rightPlayerScore === maxScore){
        console.log('player 1 won');
        endGameAnimation();
    }
    else if (leftPlayerScore === maxScore){
        console.log('player 2 won');
        endGameAnimation();
    } 
}

// END GAME ANIMATION
function endGameAnimation(){
 const pixelSize = 30; // Size of each pixel square
 const rows = Math.floor(canvas.width / pixelSize);
 const cols = Math.floor(canvas.height / pixelSize);

 // Function to draw a pixel square
 function drawPixel(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
 }

 // Initialize pixels array with random black and white values
 const pixels = [];
 for (let i = 0; i < rows; i++) {
   pixels[i] = [];
   for (let j = 0; j < cols; j++) {
     pixels[i][j] = Math.random() < 0.5 ? '#000' : '#fff';
   }
 }

 // Function to update and draw the animation frame
 function update() {
   for (let i = 0; i < rows; i++) {
     for (let j = 0; j < cols; j++) {
       if (Math.random() < 0.01) {
         // Dissolve pixel with a random chance
         pixels[i][j] = '#000';
       }
       drawPixel(i, j, pixels[i][j]);
     }
   }
 }

 // Animation loop
 function animate() {
   requestAnimationFrame(animate);
   update();
 }

 // Resize canvas when the window is resized
 window.addEventListener('resize', () => {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
 });

 // Start the animation loop
 animate();
}

// MAIN PING PONG LOOP
function loop() {
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (gameStarted) {
        leftPaddle.y += leftPaddle.dy;
        rightPaddle.y += rightPaddle.dy;

        if (leftPaddle.y < grid) {
            leftPaddle.y = grid;
        } else if (leftPaddle.y > maxPaddleY) {
            leftPaddle.y = maxPaddleY;
        }

        if (rightPaddle.y < grid) {
            rightPaddle.y = grid;
        } else if (rightPaddle.y > maxPaddleY) {
            rightPaddle.y = maxPaddleY;
        }

        context.fillStyle = 'white';
        context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
        context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y < grid) {
            ball.y = grid;
            ball.dy *= -1;
        } else if (ball.y + grid > canvas.height - grid) {
            ball.y = canvas.height - grid * 2;
            ball.dy *= -1;
        }

        if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
            if (ball.x < 0) {
                rightPlayerScore++;
            } else {
                leftPlayerScore++;
            }
            ball.resetting = true;

            setTimeout(() => {
                ball.resetting = false;
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
            }, 400);
        }

        drawScores(); // Update scores on canvas
        scoreCheck(rightPlayerScore, leftPlayerScore); // check for end game condition to trigger end animation

        if (collides(ball, leftPaddle)) {
            ball.dx *= -1;
            ball.x = leftPaddle.x + leftPaddle.width;
        } else if (collides(ball, rightPaddle)) {
            ball.dx *= -1;
            ball.x = rightPaddle.x - ball.width;
        }

        context.fillRect(ball.x, ball.y, ball.width, ball.height);
        context.fillStyle = 'lightgrey';
        context.fillRect(0, 0, canvas.width, grid);
        context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

        for (let i = grid; i < canvas.height - grid; i += grid * 2) {
            context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
        }
    } else {
        context.fillStyle = 'white';
        context.font = '30px Arial';
        context.fillText('Click Start Game to Play', 200, canvas.height / 2);
    }
    
}

// START BUTTON AND LISTENERS
document.getElementById('startButton').addEventListener('click', function() {
    gameStarted = true;
    canvas.style.display = 'block';
    this.style.display = 'none';
    requestAnimationFrame(loop);
});

document.addEventListener('keydown', function(e) {
    if (e.which === 38) {
        rightPaddle.dy = -paddleSpeed;
    } else if (e.which === 40) {
        rightPaddle.dy = paddleSpeed;
    }

    if (e.which === 87) {
        leftPaddle.dy = -paddleSpeed;
    } else if (e.which === 83) {
        leftPaddle.dy = paddleSpeed;
    }
});

document.addEventListener('keyup', function(e) {
    if (e.which === 38 || e.which === 40) {
        rightPaddle.dy = 0;
    }

    if (e.which === 83 || e.which === 87) {
        leftPaddle.dy = 0;
    }
});

requestAnimationFrame(loop);

// reusuable functions

function fadeIn()
{
    // context.clearRect(0,0, canvas.width,canvas.height);
    context.globalAlpha = ga;
    var photo = new Image();
    photo .onload = function()
    {
        context.drawImage(photo , 0, 0, 450, 500);
    };
    photo .src = "photo .jpg";

    ga = ga + 0.1;

    if (ga > 1.0)
    {
        fadeOut();
        goingUp = false;
        clearInterval(timerId);

    }
}

function fadeOut()
{
    // context.clearRect(0,0, canvas.width,canvas.height);
    context.globalAlpha = ga;

    var photo = new Image();
    photo .onload = function()
    {
        context.drawImage(photo , 0, 0, 450, 500);
    };
    photo .src = "photo .jpg";

    ga = ga - 0.1;

    if (ga < 0)
    {

        goingUp = false;
        clearInterval(timerId);
    }
}
