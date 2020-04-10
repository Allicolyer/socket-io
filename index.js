var express = require("express");
const path = require("path");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var socketCallback = require("./client/src/utils/enums.js").socketCallback
var rooms = require("./client/src/utils/enums.js").rooms

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// makes a copy of the starting transcript that is edited as clients send messages
const startingTranscripts = Object.values(rooms).map(room => room.startingTranscripts)
var currentTranscripts = Object.assign({}, startingTranscripts);

//fires when a client connection to the server
io.on("connection", function (socket) {
  //log when user connects
  console.log("user connected");
  //handle disconnection from server
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
  //join the Misc room when first connected
  let defaultRoom = rooms.misc.name
  socket.join(defaultRoom);
  //sends the transcript for the room Misc to the new client
  socket.emit(socketCallback.updateTranscript, currentTranscripts[defaultRoom]);
  //function for when the client sends a chat message
  socket.on(socketCallback.chatMessage, function (name, msg, room) {
    //sends the message to everyone else
    socket.broadcast.to(room).emit(socketCallback.chatMessage, name, msg, false, false);
    //sends the message back to you with isCurrentUser set to true
    socket.emit(socketCallback.chatMessage, name, msg, true, false);
    //update the transcript
    currentTranscripts[room] = `${currentTranscripts[room]} ${msg}`;
    //sends the updated transcript to the clients
    io.sockets.emit(socketCallback.updateTranscript, currentTranscripts[room]);
  });

  //function for when the AI sends a message
  socket.on(socketCallback.aiMessage, function (name, msg, room) {
    //sends the message to all of the clients in that rooms
    io.sockets.in(room).emit(socketCallback.chatMessage, name, msg, false, true);
    //updates the transcript and sends it all connected clients
    currentTranscripts[room] = `${currentTranscripts[room]} ${msg}`;
    io.sockets.emit(socketCallback.updateTranscript, currentTranscripts[room]);
  });

  // function for when client changes room
  socket.on(socketCallback.changeRoom, function (currentRoom, nextRoom) {
    //leave the old room and join the new room
    socket.leave(currentRoom);
    socket.join(nextRoom);
    //sends transcript for that room to the client
    socket.emit(socketCallback.updateTranscript, currentTranscripts[nextRoom]);
  });

  // function for reseting transcript
  socket.on(socketCallback.resetTranscript, function (currentRoom) {
    //reset transcript for the room back to the startings transcript
    currentTranscripts[currentRoom] = startingTranscripts[currentRoom];
    //send the updated transcript to all clients in that room
    io.sockets.emit(socketCallback.updateTranscript, currentTranscripts[currentRoom]);
  });
});

http.listen(process.env.PORT || 4000, function () {
  console.log("listening on *:4000");
});