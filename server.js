const http = require("http");
const sockets = require("./sockets");

const port = process.env.PORT || 3000;
const io = require("socket.io").listen(port);
const apiServer = require("./api").listen(port);
const httpServer = http.createServer(apiServer);
const socketServer = io(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

sockets.listen(socketServer);