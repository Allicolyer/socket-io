var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

//use static files
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  socket.on("chat message", function(name, msg) {
    socket.broadcast.emit("chat message", name, msg);
  });
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});
http.listen(3000, function() {
  console.log("listening on *:3000");
});
