const http = require("http");
const sockets = require("./sockets");
const io = require("socket.io");

const port = process.env.PORT || 3000;

const apiServer = require("./api");
const httpServer = http.createServer(apiServer);

const socketServer = io(httpServer, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

sockets.listen(socketServer);