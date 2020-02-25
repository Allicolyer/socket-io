import React from "react";
import { Message } from "./Message";
import Modal from "./Modal";
import Transcript from "./Transcript";

import { apiCall } from "../utils/api-call";

export class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "guest",
      message: "",
      messages: [],
      context: "",
      show: true
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  addMessage(name, message, isCurrentUser, isAIUser) {
    //Keep track of all message text, including punctuation
    this.updateContext(message);

    if (isAIUser) {
      //clean it up before adding it to the messages state
      message
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

  updateContext(message) {
    this.setState({ context: `${this.state.context} ${message}` });
  }

  sendAIMessage() {
    apiCall(this.state.context).then(res =>
      this.props.socket.emit("AI message", `Robot from ${this.state.name}`, res)
    );
  }

  playAudio(file) {
    let audio = new Audio(file);
    audio.play();
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.socket.emit("chat message", this.state.name, this.state.message);
    this.state.message = "";
  }

  showModal = event => {
    this.setState({
      show: !this.state.show
    });
  };

  enterUsername = event => {
    event.preventDefault();
    this.showModal();
  };

  render() {
    return (
      <div>
        <Modal onClose={this.showModal} show={this.state.show}>
          <form onSubmit={this.enterUsername}>
            <input
              id="name"
              type="text"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </form>
        </Modal>
        <button className="modal-button" onClick={this.showModal}>
          Change Username
        </button>
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
        <Transcript context={this.state.context} />
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
    );
  }
}
