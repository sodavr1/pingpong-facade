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

