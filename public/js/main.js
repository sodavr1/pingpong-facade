const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const socket = io();

// GAME GLOBALS VARS
let gameID = 0; //temp for testing
let gameUUID = crypto.randomUUID();
let liveUUID = crypto.randomUUID();

let timeLimit = 20; //seconds

const grid = 10;
const paddleHeight = grid * 8; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

var paddleSpeed = 10;
var ballSpeed = 2.2;
var leftPlayerScore = 0;
var rightPlayerScore = 0;

var gameStarted = false;
let gameOver = false;
const maxScore = 10;

// DRAWING CONTROLS 
const leftPaddle = {
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid * 2,
    height: paddleHeight,
    dy: 0
};

const rightPaddle = {
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid * 2,
    height: paddleHeight,
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: grid * 2,
    height: grid * 2,
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
    context.font = '12px Silkscreen';
    context.fillText('Player 1: ' + leftPlayerScore, 85, 30);
    context.fillText('Player 2: ' + rightPlayerScore, canvas.width - 110, 30);
}

// END GAME ANIMATION
function endGameAnimation() {
    let startTime;
    const duration = 10000; // 10 seconds
    const winnerText = leftPlayerScore > rightPlayerScore ? 'Player 1' : 'Player 2';
    const text = 'Winner\n'+winnerText;

      function animate(currentTime) {
        if (!startTime) {
          startTime = currentTime;
        }

        const elapsed = currentTime - startTime;

        const alpha = Math.min(1, elapsed / duration);

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Set the background color with alpha value for fading effect
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Set text properties
        context.font = '40px Silkscreen';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Place text at the center
        const textX = canvas.width / 2;
        const textY = canvas.height / 4;
        context.fillText(text, textX, textY);
          // Place text at the center
          const textXScore = canvas.width / 2;
          const textYScore = canvas.height / 3;
          context.fillText('Score:' +leftPlayerScore > rightPlayerScore ? leftPlayerScore : rightPlayerScore, textXScore, textYScore);
        if (elapsed < duration) {
          requestAnimationFrame(animate);
        }
        else{
            console.log('trigger reset');
            gameOver = true;
            ball.resetting = true;
            SendScoreData();
            resetGame();
        }
      }
      requestAnimationFrame(animate);
}

function resetGame(){
    timeLimit = 20;
    leftPlayerScore = 0;
    rightPlayerScore = 0;
    ball.resetting = false;

    gameOver = false;
    gameStarted = true;
    countdownTimer(timeLimit, endGameAnimation);
    requestAnimationFrame(loop);
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

        if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting && !gameOver) {
            if (ball.x < 0) {
                socket.emit('player 2 Scored', rightPlayerScore);
                rightPlayerScore++;
                updateLiveScoreData();
            } else {
                socket.emit('player 1 Scored', leftPlayerScore);
                leftPlayerScore++;
                updateLiveScoreData();
            }
            ball.resetting = true;

            setTimeout(() => {
                ball.resetting = false;
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
            }, 400);
        }

        drawScores(); // Update scores on canvas

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
        context.font = '30px Silkscreen';
        context.fillText('Click Start Game to Play', 200, canvas.height / 2);
    }
}

// START BUTTON AND LISTENERS
document.getElementById('startButton').addEventListener('click', function () {
    gameStarted = true;
    canvas.style.display = 'block';
    this.style.display = 'none';
    countdownTimer(timeLimit, endGameAnimation);
    requestAnimationFrame(loop);
});



document.addEventListener('keydown', function (e) {
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

document.addEventListener('keyup', function (e) {
    if (e.which === 38 || e.which === 40) {
        rightPaddle.dy = 0;
    }

    if (e.which === 83 || e.which === 87) {
        leftPaddle.dy = 0;
    }
});
function handleTouch(paddle, e) {
    const touch = e.touches[0];
    const newY = touch.clientY - canvas.getBoundingClientRect().top - paddle.height / 2;

    // Ensure the paddle stays within the canvas boundaries
    const maxY = canvas.height - paddle.height;
    const minY = 0;

    paddle.y = Math.max(minY, Math.min(newY, maxY));
    // drawPaddle(ctx, paddle);
}

canvas.addEventListener("touchstart", function (e) {
    handleTouch(leftPaddle, e);
    handleTouch(rightPaddle, e);
    e.preventDefault(); // Prevent default touch behavior
});

canvas.addEventListener("touchmove", function (e) {
    handleTouch(leftPaddle, e);
    handleTouch(rightPaddle, e);
});


// REUSEABLE FUNCTIONS
// fade with custum alpha, data params
function fade(alpha, delta) {
    alpha += delta;
    if (alpha <= 0 || alpha >= 1) delta = -delta;
    /// clear canvas, set alpha and re-draw image
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = alpha;
}

// timer with params
function Timer(func, time) {
    return setTimeout(func, time)
}

function countdownTimer(seconds, callback) {
    let remainingTime = seconds;
    function updateTimer() {
        if (remainingTime > 0) {
            console.log(`${remainingTime} seconds remaining`);
            remainingTime--;
            setTimeout(updateTimer, 1000); // Update every 1 second (1000 milliseconds)
        } else {
            if (callback && typeof callback === "function") {
                callback(); // Execute the callback function when the timer reaches zero
            }
        }
    }
    updateTimer(); // Start the countdown
}

// DATA REQUESTS
// update live score
function updateLiveScoreData() {
    if (!gameOver) {
        fetch("http://localhost:3000/livescore", {
            method: "POST",
            body: JSON.stringify({
                // MAKE THIS A  UUID LATER
                id: liveUUID,
                player1: leftPlayerScore,
                player2: rightPlayerScore,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    }
}
// update backend with final score or live score
function SendScoreData() {
    if (gameOver) {
        console.log(gameUUID);
        fetch("http://localhost:3000/scores", {
            method: "POST",
            body: JSON.stringify({
                id: gameUUID, // MAKE THIS A  UUID LATER
                player1: leftPlayerScore,
                player2: rightPlayerScore,
                winner: leftPlayerScore > rightPlayerScore ? 'PLAYER 1' : 'PLAYER2'
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    }
}