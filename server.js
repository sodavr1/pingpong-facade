// Import required modules using ES6 import syntax
import express from 'express';
import {createServer} from 'http';
import { Server } from 'socket.io';
// import sockets from './sockets.js'

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

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
    io.sockets.on('connection', (socket) => {
        console.log('A user connected');
        console.log('connected socket'+Object.keys(io.sockets.sockets));
        // Event listener for the 'join' event
        socket.on('joinRoom', (roomName) => {
            // Join the specified room
            socket.join(roomName);
            console.log('room name'+roomName);
            // let clients = io.sockets.clients(roomName)
            // console.log('connected to room' +clients);

            // Emit the 'playerJoined' event to all clients in the room
            // socket.to(roomName).emit('playerJoined', socket.adapter.rooms[roomName].length);
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
});


// Start the server on port 3000
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




