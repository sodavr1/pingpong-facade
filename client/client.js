import { io } from "socket.io-client";

const port = process.env.PORT || 3000;
const socket = io(`ws://localhost:${port}`);

socket.emit("chat message", "Hello, server!");
socket.on("connect", () => {
  console.log(`connect ${socket.id}`);
});
socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
socket.on("disconnect", (reason) => {
  console.log(`disconnect due to ${reason}`);
});