const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// GAME GLOBALS VARS
let gameID = 0; //temp for testing
let liveScoreID = 0;

const grid = 10;
const paddleHeight = grid * 8; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

var paddleSpeed = 9;
var ballSpeed = 2.2;
var leftPlayerScore = 0;
var rightPlayerScore = 0;

let winner;
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
    context.fillText('Player 1: ' + leftPlayerScore, 45, 30);
    context.fillText('Player 2: ' + rightPlayerScore, canvas.width - 100, 30);
}

// SCORE CHECKING END GAME TRIGGERS  
function scoreCheck(rightPlayerScore, leftPlayerScore) {
    console.log('score check called');
    if (rightPlayerScore === maxScore) {
        gameOver = true;
        winner = 'Player 1'
        fade(1, 0.1); // delta, alpha
        SendScoreData();
        endGameAnimation();
    }
    else if (leftPlayerScore === maxScore) {
        gameOver = true;
        winner = 'Player 2'
        fade(1, 0.1);
        SendScoreData();
        endGameAnimation();
    }
}

// END GAME ANIMATION
function endGameAnimation() {
    let startTime;
    const duration = 8000; // 5 seconds
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
        const textY = canvas.height / 2;
        context.fillText(text, textX, textY);

        leftPlayerScore = 0;
        rightPlayerScore = 0;
        gameOver = false;

        if (elapsed < duration) {
          requestAnimationFrame(animate);
        }
      }
      requestAnimationFrame(animate);
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
                updateLiveScoreData();
            } else {
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
        !gameOver ? scoreCheck(rightPlayerScore, leftPlayerScore) : null; // check for end game condition to trigger end animation

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

// DATA REQUESTS
// update live score
function updateLiveScoreData() {
    if (!gameOver) {
        fetch("http://localhost:3000/livescore", {
            method: "POST",
            body: JSON.stringify({
                // MAKE THIS A  UUID LATER
                id: liveScoreID++,
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
        fetch("http://localhost:3000/scores", {
            method: "POST",
            body: JSON.stringify({
                id: gameID++, // MAKE THIS A  UUID LATER
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