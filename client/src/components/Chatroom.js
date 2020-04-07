import React from "react";
import { Message } from "./Message";
import Modal from "./Modal";
import Transcript from "./Transcript";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { apiCall } from "../utils/api-call";
import { socketCallback, rooms } from "../utils/enums";


//sets the default room to Misc
const defaultRoom = rooms.misc.name;
//get all the room names from the room object
const roomNames = Object.values(rooms).map(room => room.name)

export class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //the current room for the client.
      room: defaultRoom,
      // The client's chosen username.
      name: "guest",
      // the message the client has in their input field.
      message: "",
      // the chat log of previous messages in the current room.
      messages: [],
      // a compiled version of all messages to be displayed
      // as a block in the room.
      transcript: "",
      // toggles modal windows.
      showUsernameModal: true,
      showRoomModal: false
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
  }

  // runs when the user selects another room to enter.
  // we emit to the server to fetch the transcript history
  // for us and update our state accordingly.
  changeRoom(event) {
    let nextRoomName = event.value;
    let previousRoomName = this.state.room;
    this.setState({ room: nextRoomName, messages: [] }, function () {
      this.props.socket.emit(socketCallback.changeRoom
        , previousRoomName, nextRoomName);
    });
  }

  componentDidMount() {
    const { socket } = this.props;
    this.initSocket(socket);
  }

  // initializes the socket and sets its callback behavior
  initSocket(socket) {
    // receive message code
    socket.on(socketCallback.chatMessage, (name, message, isCurrentUser, isAIUser) => {
      this.addMessage(name, message, isCurrentUser, isAIUser);
      if (isCurrentUser) {
        this.playAudio("./audio/outgoing-message.wav");
      } else {
        this.playAudio("./audio/incoming-message.mp3");
      }
    });

    socket.on(socketCallback.updateTranscript, transcript => {
      this.setState({ transcript: transcript });
    });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  // when we receive a new message from the server,
  // we add it to our list of messages to display.
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

  // we call this to make a call to a server GPT-2
  // for an automated response to our outgoing message.
  sendAIMessage() {
    apiCall(this.state.transcript).then(res =>
      this.props.socket.emit(socketCallback.aiMessage, `Robot`, res, this.state.room)
    );
  }

  playAudio(file) {
    let audio = new Audio(file);
    audio.play();
  }

  // called when a user submits the
  // contents of their message in the input field.
  // sends it to the server to update the transcript
  // and all other sockets' message logs.
  handleSubmit(event) {
    event.preventDefault();
    this.props.socket.emit(
      socketCallback.chatMessage,
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

  // resets the room's transcript back to its default
  // for all clients.
  resetTranscript = event => {
    this.setState({ messages: [] }, function () {
      this.props.socket.emit(socketCallback.resetTranscript, this.state.room);
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
          <a className="margin-x" href="/">
            <img className="logo" src="https://placekitten.com/200/200" />
          </a>
          <div className="nav-container">
            <a
              className="nav-link margin-x"
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
            <button className="button">Send</button>
          </form>
          <Transcript context={this.state.transcript} />
        </div>
      </div>
    );
  }
}
