// Import required modules using ES6 import syntax
import express from 'express';
import {createServer} from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: ["game-header"],
    credentials: true
  }
});

const gameState = {
  players: {}
}

// Serve static files from the 'public' folder
app.use(express.static("public"));
// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected');
  // Example: Handling disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
    // Handle socket connections
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('newPlayer', () => {
          gameState.players[socket.id] = {
            x: 250,
            y: 250,
            width: 25,
            height: 25
          }
        });
        // Event listener for the 'join' event
        socket.on('joinRoom', (roomName) => {
            // Join the specified room
            socket.join(roomName);
            console.log('roomename'+roomName)
            io.to(roomName).emit('userList', getUsersInRoom(roomName));
        });

        // Event listener for the 'startGame' event
        socket.on('startGame', () => {
            // Emit the 'startGame' event to all clients in the room
            const roomName = Object.keys(socket.rooms)[1]; // Get the room name
            io.to(roomName).emit('startGame');
        });

        // Handle disconnections
        socket.on('disconnect', () => {
            console.log('A user disconnected');
            delete gameState.players[socket.id]
        });
    });

    setInterval(() => {
      io.sockets.emit('state', gameState);
    }, 1000 / 60);
    
});

function getUsersInRoom(room) {
  const clients = io.sockets.adapter.rooms.get(room);
  if (clients) {
    return Array.from(clients).map((clientId) => io.sockets.sockets.get(clientId).id);
  } else {
    return [];
  }
}

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




