var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

io.on("connection", function(socket) {
  socket.on("chat message", function(name, msg) {
    //sends the message to everyone else
    socket.broadcast.emit("chat message", name, msg, false, false);
    //sends the message back to you with isCurrentUser set to true
    socket.emit("chat message", name, msg, true, false);
  });
  socket.on("AI message", function(name, msg) {
    io.emit("chat message", name, msg, false, true);
  });
  console.log("a great user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});
http.listen(4000, function() {
  console.log("listening on *:4000");
});
