$(function() {
  var socket = io();

  $("form").submit(function(e) {
    e.preventDefault(); // prevents page reloading

    //get name and message from input fields
    let name = $("#name").val();
    let message = $("#message").val();
    //emit the message to all other users
    socket.emit("chat message", name, message);
    ///add the message to the window
    addMessage(name, message, true);
    //play outgoing message sound
    playAudio("../audio/outgoing-message.wav");
    //clear the input field
    $("#message").val("");
    return false;
  });

  socket.on("chat message", function(name, message) {
    ///add the message to the window
    addMessage(name, message, false);
    //play incoming message sound
    playAudio("../audio/incoming-message.mp3");
  });
});

//play the audio file
const playAudio = file => {
  let audio = new Audio(file);
  audio.play();
};

const addMessage = (name, message, currentUser) => {
  //set up name and message span
  let nameAndMessage = `<span class='name'>${name}:</span> ${message}`;
  //conditionally add the current-user class
  let html =
    `<li ${(currentUser && "class=current-user") || ""}>` +
    nameAndMessage +
    `</li>`;
  $("#messages").append(html);
};
