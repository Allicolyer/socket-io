import React from "react";
import { Message } from "./Message";
import Modal from "./Modal";
import Transcript from "./Transcript";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import { apiCall } from "../utils/api-call";

const roomOptions = {
  "Under the Sea":
    "Under the sea, under the sea, everything's better down where it's wetter, take it from me!",
  Zork: "TBD",
  Pandemic: "Make sure you stay socially isolated!",
  Misc: ""
};

const roomNames = Object.keys(roomOptions);

const defaultRoom = roomNames[3];

export class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room: defaultRoom,
      name: "guest",
      message: "",
      messages: [],
      transcript: "",
      showUsernameModal: true,
      showRoomModal: false
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
  }

  changeRoom(event) {
    let nextRoomName = event.value;
    let previousRoomName = this.state.room;
    this.setState(
      { room: nextRoomName, context: roomOptions[nextRoomName], messages: [] },
      function() {
        this.props.socket.emit("room", previousRoomName, nextRoomName);
      }
    );
  }

  componentDidMount() {
    const { socket } = this.props;
    this.initSocket(socket);
  }

  initSocket(socket) {
    // receive message code
    socket.on("chat message", (name, message, isCurrentUser, isAIUser) => {
      this.addMessage(name, message, isCurrentUser, isAIUser);
      if (isCurrentUser) {
        this.playAudio("./audio/outgoing-message.wav");
      } else {
        this.playAudio("./audio/incoming-message.mp3");
      }
    });

    socket.on("transcript", transcript => {
      this.setState({ transcript: transcript });
    });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  addMessage(name, message, isCurrentUser, isAIUser) {
    //Keep track of all message text, including punctuation
    // this.updateContext(message);
    if (isAIUser) {
      //clean it up before adding it to the messages state
      message = message
        .replace(/[\r\n]/g, " ")
        .replace(/[\/#.,;!?$%\^&\*:{}=\_`~()]/g, " ")
        .replace(/["]/g, "<-")
        .replace(/\s\s+/g, " ")
        .trim();
    }
    // adding some message to our state
    this.setState({
      messages: [
        ...this.state.messages,
        { name: name, message: message, isCurrentUser: isCurrentUser }
      ]
    });

    // Send an AI message
    if (isCurrentUser) {
      this.sendAIMessage();
    }
  }

  sendAIMessage() {
    apiCall(this.state.transcript).then(res =>
      this.props.socket.emit(
        "AI message",
        `Robot from ${this.state.name}`,
        res,
        this.state.room
      )
    );
  }

  playAudio(file) {
    let audio = new Audio(file);
    audio.play();
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.socket.emit(
      "chat message",
      this.state.name,
      this.state.message,
      this.state.room
    );
    this.setState({
      message: ""
    });
  }

  showUsernameModal = event => {
    this.setState({
      showUsernameModal: !this.state.showUsernameModal
    });
  };

  showRoomModal = event => {
    this.setState({
      showRoomModal: !this.state.showRoomModal
    });
  };

  enterUsername = event => {
    event.preventDefault();
    this.showUsernameModal();
  };

  render() {
    return (
      <div>
        <Modal
          onClose={this.showUsernameModal}
          show={this.state.showUsernameModal}
          header="Enter Username"
        >
          <form onSubmit={this.enterUsername}>
            <input
              id="name"
              type="text"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </form>
        </Modal>
        <Modal
          onClose={this.showRoomModal}
          show={this.state.showRoomModal}
          header="Switch Room"
        >
          <Dropdown
            options={roomNames}
            onChange={this.changeRoom}
            value={defaultRoom}
            placeholder="Select a Room"
          />
          ;
        </Modal>
        <button className="modal-button" onClick={this.showUsernameModal}>
          Change Username
        </button>
        <button className="modal-button" onClick={this.showRoomModal}>
          Change Room
        </button>
        <h1>{this.state.room}</h1>
        <div className="chatroom-container">
          <div className="chat-window">
            <ul id="messages">
              {this.state.messages.map((m, i) => (
                <Message
                  key={i}
                  name={m.name}
                  message={m.message}
                  isCurrentUser={m.isCurrentUser}
                />
              ))}
            </ul>
            <form onSubmit={this.handleSubmit} className="message-form">
              <input
                id="message"
                type="text"
                value={this.state.message}
                onChange={this.handleMessageChange}
              />
              <button>Send</button>
            </form>
          </div>
          <div className="transcript-window">
            <Transcript context={this.state.transcript} />
          </div>
        </div>
      </div>
    );
  }
}
