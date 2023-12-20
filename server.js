// Import required modules using ES6 import syntax
import express from 'express';
import {createServer} from 'http';
import { Server } from 'socket.io';

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
});
// Start the server on port 3000
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let readyPlayerCount = 0;

const pongNamespace = io.of('http://localhost:3000');
pongNamespace.on('connection', (socket) => {
        let room;

        console.log('a user connected', socket.id);

        socket.on('ready', () => {
            room = 'room' + Math.floor(readyPlayerCount / 2);
            socket.join(room);

            console.log('Player ready', socket.id, room);

            readyPlayerCount++;

            if (readyPlayerCount % 2 === 0) {
                pongNamespace.in(room).emit('startGame', socket.id);
            }
        });

        socket.on('paddleMove', (paddleData) => {
            socket.to(room).emit('paddleMove', paddleData);
        });

        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballMove', ballData);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
            socket.leave(room);
        });
    })


