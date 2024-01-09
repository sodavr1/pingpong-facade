const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// socket io connection (CDN 4.7.2)
const socket = io('http://localhost:3000/', {
    withCredentials: true,
    extraHeaders: {
        "game-header": "gameheader"
    }
});
socket.on("connect", () => {
    console.log(`connect ${socket.id}`);
    joinRoom('pong');
    // Emit a message to the server
    socket.emit('chat message', 'Hello, server!');
});

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("disconnect", (reason) => {
    console.log(`disconnect due to ${reason}`);
    socket.emit('userList', 'pong');
    updateUserLength(users.length);
});

socket.on('paddleMove', (paddleData) => {
    // Toggle 1 into 0, and 0 into 1
    // const opponentPaddleIndex = 1 - paddleIndex;
    // paddleX[opponentPaddleIndex] = paddleData.xPosition;
});

socket.on('ballMove', (ballData) => {
    // ({ ballX, ballY, score } = ballData);
});

socket.on('userList', (users) => {
    console.log('Users in the room:', users.length);
    updateUserLength(users.length);
});

function updateUserLength(newUserLength){
    users = newUserLength;
}

// Function to join a room
function joinRoom(roomName) {
    console.log('joinroom ran' + roomName);
    socket.emit('joinRoom', roomName);
}

// GAME GLOBALS VARS
let gameUUID = crypto.randomUUID(); let liveUUID = crypto.randomUUID();
let users;

let timeLimit = 20; //seconds
const grid = 10;
const paddleHeight = grid * 8; // 80
const maxPaddleY = canvas.height - grid - paddleHeight;

let paddleSpeed = 10;
let ballSpeed = 2.2;
let leftPlayerScore = 0;
let rightPlayerScore = 0;

let gameStarted = false;
let gameOver = false;


// DRAWING CONTROLS 
const leftPaddle = {
    id: 'leftPad',
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid * 2,
    height: paddleHeight,
    dy: 0
};

const rightPaddle = {
    id: 'rightPad',
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
    const text = 'Winner\n' + winnerText;

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
        context.fillText('Score:' + leftPlayerScore > rightPlayerScore ? leftPlayerScore : rightPlayerScore, textXScore, textYScore);
        if (elapsed < duration) {
            requestAnimationFrame(animate);
        }
        else {
            console.log('trigger reset');
            gameOver = true;
            SendScoreData();
            resetGame();
        }
    }
    requestAnimationFrame(animate);
}

function resetGame() {
    timeLimit = 20;
    leftPlayerScore = 0;
    rightPlayerScore = 0;
    // ball.resetting = false;
    ballSpeed = 2.2;
    gameOver = false;
    gameStarted = true;
    // set new random UUID game ID to prevent duplication 
    gameUUID = crypto.randomUUID()
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
                rightPlayerScore++;
                socket.emit('player2score', rightPlayerScore, liveUUID);
                liveUUID = crypto.randomUUID();
                updateLiveScoreData();

            } else {
                leftPlayerScore++;
                socket.emit('player1score', leftPlayerScore, liveUUID);
                liveUUID = crypto.randomUUID();
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
    // update user list to check if there are two players in room
    socket.emit('userList', 'pong');
    if (users === 2) {
        gameStarted = true;
        canvas.style.display = 'block';
        this.style.display = 'none';
        socket.emit('ready');
        countdownTimer(timeLimit, endGameAnimation);
        requestAnimationFrame(loop);
    }
    else {
        alert('Waiting for another player');
    }
});

document.addEventListener('keydown', function (e) {
    if (e.which === 38) {
        rightPaddle.dy = -paddleSpeed;
        socket.emit('paddleMove', {
            // xPosition: paddleX[paddleIndex],
        });
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

// Add touch event listeners to the canvas
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

// Variables to store touch positions
let leftTouchY = null; let rightTouchY = null;

// Handle touch start event
function handleTouchStart(event) {
    event.preventDefault();
    // Iterate through all touches
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        // Check if touch is on the left or right side of the canvas
        if (touch.clientX < canvas.width / 2) {
            leftTouchY = touch.clientY;
        } else {
            rightTouchY = touch.clientY;
        }
    }
}

// Handle touch move event
function handleTouchMove(event) {
    event.preventDefault();
    // Iterate through all touches
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];

        // Update the paddle positions based on the touch movements
        if (touch.clientX < canvas.width / 2) {
            leftPaddle.y = touch.clientY - paddleHeight / 2;
        } else {
            rightPaddle.y = touch.clientY - paddleHeight / 2;
        }
    }
}

// Add touchend event listeners to reset touch positions when touches end
canvas.addEventListener('touchend', handleTouchEnd);

// Handle touch end event
function handleTouchEnd(event) {
    event.preventDefault();

    // Iterate through all touches
    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];

        // Check if touch has ended on the left or right side of the canvas
        if (touch.clientX < canvas.width / 2) {
            leftTouchY = null;
        } else {
            rightTouchY = null;
        }
    }
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
        fetch("http://localhost:3001/livescore", {
            method: "POST",
            body: JSON.stringify({
                // MAKE THIS A  UUID LATER
                id: liveUUID,
                gameid: gameUUID,
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
        fetch("http://localhost:3001/scores", {
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