// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use('/images',express.static(path.join(__dirname, '/images')));
app.use('/js',express.static(path.join(__dirname, '/js')));
app.use('/css',express.static(path.join(__dirname, '/css')));
app.use('/screens',express.static(path.join(__dirname, '/screens')));
// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit("a user connected");

  // Example: Broadcast a message to all connected clients
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  //player 1 score
  socket.on("player1score", (arg) => {
    console.log(arg); // world
    updateLiveScoreData();
  });

  socket.on("player2score", (arg) => {
    console.log(arg); // world
    updateLiveScoreData();
  });

});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

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