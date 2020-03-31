var express = require("express");
const path = require("path");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// starting transcriptions
var startingTranscripts = {
  "Under the Sea":
    "Under the sea, under the sea, everything's better down where it's wetter, take it from me!",
  Zork:
    "West of House. This is an open field west of a white house, with a boarded front door. There is a small mailbox here. A rubber mat saying 'Welcome to Zork!' lies by the door.",
  Pandemic:
    "A report found that Coronavirus is now four diseases that have broken out in the world, each threatening to wipe out a region.",
  Misc: ""
};

// makes a copy of the starting transcript
var currentTranscripts = Object.assign({}, startingTranscripts);

io.on("connection", function(socket) {
  socket.join("Misc");
  socket.emit("transcript", currentTranscripts["Misc"]);
  socket.on("chat message", function(name, msg, room) {
    console.log("receiving message from " + name);
    //sends the message to everyone else
    socket.broadcast.to(room).emit("chat message", name, msg, false, false);
    //sends the message back to you with isCurrentUser set to true
    socket.emit("chat message", name, msg, true, false);
    //update the transcript
    currentTranscripts[room] = `${currentTranscripts[room]} ${msg}`;
    io.sockets.emit("update transcript", currentTranscripts[room]);
  });
  socket.on("AI message", function(name, msg, room) {
    io.sockets.in(room).emit("chat message", name, msg, false, true);
    //update the transcript
    currentTranscripts[room] = `${currentTranscripts[room]} ${msg}`;
    io.sockets.emit("update transcript", currentTranscripts[room]);
  });
  console.log("a great user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("room", function(currentRoom, nextRoom) {
    socket.leave(currentRoom);
    socket.join(nextRoom);
    socket.emit("update transcript", currentTranscripts[nextRoom]);
  });

  socket.on("reset transcript", function(currentRoom) {
    currentTranscripts[currentRoom] = startingTranscripts[currentRoom];
    io.sockets.emit("update transcript", currentTranscripts[currentRoom]);
  });
});

http.listen(process.env.PORT || 4000, function() {
  console.log("listening on *:4000");
});
