import React from "react";
import { Message } from "./Message";
import Modal from "./Modal";
import Transcript from "./Transcript";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { apiCall } from "../utils/api-call";

const roomNames = ["Under the Sea", "Zork", "Pandemic", "Misc"];

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
    this.setState({ room: nextRoomName, messages: [] }, function() {
      this.props.socket.emit("room", previousRoomName, nextRoomName);
    });
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

    socket.on("update transcript", transcript => {
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
      this.props.socket.emit("AI message", `Robot`, res, this.state.room)
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

  resetTranscript = event => {
    this.setState({ messages: [] }, function() {
      this.props.socket.emit("reset transcript", this.state.room);
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
        </Modal>

        <nav>
          <a class="margin-x" href="/">
            <img class="logo" src="https://placekitten.com/200/200" />
          </a>
          <div class="nav-container">
            <a
              class="nav-link margin-x"
              target="_blank"
              href="https://github.com/Allicolyer/socket-io"
            >
              Github
            </a>
          </div>
        </nav>

        <div className="content margin-y">
          <div className="header card margin-y">
            <h1>{this.state.room}</h1>
            <div>
              <button className="button" onClick={this.resetTranscript}>
                Reset
              </button>
              <button className="button" onClick={this.showUsernameModal}>
                Change Username
              </button>
              <button className="button" onClick={this.showRoomModal}>
                Change Room
              </button>
            </div>
          </div>

          <ul id="message-container" className="card margin-y">
            {this.state.messages.map((m, i) => (
              <Message
                key={i}
                name={m.name}
                message={m.message}
                isCurrentUser={m.isCurrentUser}
              />
            ))}
          </ul>
          <form
            onSubmit={this.handleSubmit}
            className="message-form flex-row card margin-y"
          >
            <input
              id="message"
              type="text"
              value={this.state.message}
              onChange={this.handleMessageChange}
            />
            <button class="button">Send</button>
          </form>
          <Transcript context={this.state.transcript} />
        </div>
      </div>
    );
  }
}
