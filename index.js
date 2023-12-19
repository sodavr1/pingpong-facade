const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const app = express();
app.use(express.static(__dirname + '/public'));

const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

// add your socketio code here

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
