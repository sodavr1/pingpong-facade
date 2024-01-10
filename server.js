// Import required modules using ES6 import syntax
import express from 'express';
import {createServer} from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: ["game-header"],
    credentials: true
  }
});

httpServer.listen(PORT);

// Serve static files from the 'public' folder
app.use(express.static("public"));
// Socket.IO connection event

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('A user connected');

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
    });
});

function getUsersInRoom(room) {
  const clients = io.sockets.adapter.rooms.get(room);
  if (clients) {
    return Array.from(clients).map((clientId) => io.sockets.sockets.get(clientId).id);
  } else {
    return [];
  }
}

