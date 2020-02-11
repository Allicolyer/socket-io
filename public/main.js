$(function() {
  var socket = io();
  $("form").submit(function(e) {
    e.preventDefault(); // prevents page reloading
    let name = $("#name").val();
    let message = $("#m").val();
    let html =
      "<li class='current-user'><span class='name'>" +
      name +
      ": </span>" +
      message +
      "</li>";
    socket.emit("chat message", name, message);
    $("#messages").append(html);
    $("#m").val("");
    return false;
  });
  socket.on("chat message", function(name, message) {
    let html =
      "<li><span class='other-name'>" + name + ": </span>" + message + "</li>";
    $("#messages").append(html);
  });
});
