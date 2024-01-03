// Import required modules using ES6 import syntax
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "ws://localhost:3001/scores",
    allowedHeaders: ["game-header"],
    credentials: true
  }
});
// Serve static files from the 'public' folder
app.use(express.static("public"));
  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('A user connected');
    // Event listener for the 'join' event
    socket.on('joinRoom', (roomName) => {
      // Join the specified room
      socket.join(roomName);
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

// Start the server on port 3001
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});