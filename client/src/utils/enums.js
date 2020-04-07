const socketCallback = {
  //update transcript
  updateTranscript: "update transcript",
  //reset transcript
  resetTranscript: "reset transcript",
  //room
  changeRoom: "change room",
  //chat message
  chatMessage: "chat message",
  //AI message
  aiMessage: "AI message",
  //connection
  connectClient: "connection",
  //disconnect
  disconnectClient: "disconnect"
}

const rooms = {
  underTheSea:
  {
    name: "Under the Sea",
    startingTranscript: "Under the sea, under the sea, everything's better down where it's wetter, take it from me!"
  },
  zork:
  {
    name: "Zork",
    startingTranscript: "West of House. This is an open field west of a white house, with a boarded front door. There is a small mailbox here. A rubber mat saying 'Welcome to Zork!' lies by the door."
  },
  pandemic:
  {
    name: "Pandemic",
    startingTranscript: "A report found that Coronavirus is now four diseases that have broken out in the world, each threatening to wipe out a region."
  },
  misc: {
    name: "Misc",
    startingTranscript: ""
  },
}

module.exports = { socketCallback, rooms }
