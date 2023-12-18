const express = require("express");
var app = express();
var server = require("http").Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log(socket.id);
  

  socket.on("connect", () => {
    console.log("a user connected");
    console.log(socket.connected); // true
  });

  socket.on("connect_error", () => {
    console.log("user connect_error");
  });

  socket.on("disconnect", () => {
    console.log(socket.connected); // false
    console.log("user disconnected");
  });


});
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});