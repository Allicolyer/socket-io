var express = require("express");
const path = require("path");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

var transcripts = {
  'Under the Sea':  "I'm Seaful smart",
  'Zork': "I'm Zork smart",
  'Pandemic': "I'm Pandemic smart",
  'Misc': "I'm dumb"
}

io.on("connection", function(socket) {
  socket.join("Default Room");
  socket.on("chat message", function(name, msg, room) {
    console.log("receiving message from " + name);
    //sends the message to everyone else
    socket.broadcast.to(room).emit("chat message", name, msg, false, false);
    //sends the message back to you with isCurrentUser set to true
    socket.emit("chat message", name, msg, true, false);
  });
  socket.on("AI message", function(name, msg, room) {
    io.sockets.in(room).emit("chat message", name, msg, false, true);
  });
  console.log("a great user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("room", function (currentRoom, nextRoom) {
    socket.leave(currentRoom);
    socket.join(nextRoom);
    socket.emit("history", transcripts[nextRoom])
  });
});

http.listen(process.env.PORT || 4000, function() {
  console.log("listening on *:4000");
});
