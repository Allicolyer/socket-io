import React from "react";
import { Message } from "./Message";
import Modal from "./Modal";
import { apiCall } from "../utils/api-call";

export class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "guest", message: "", messages: [], show: true };

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
    socket.on("chat message", (name, message, isCurrentUser) => {
      this.addMessage(name, message, isCurrentUser);
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

  addMessage(name, message, isCurrentUser) {
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
    let last = this.state.messages.length - 1;
    let context = ""

    this.state.messages.forEach(message => {
      context += message.message + " ";
    });
    
    // replace all new lines with spaces
    context = context.replace(/[\r\n]/g, " ")
    //replace all two+ spaces with a single space.
    .replace(/\s\s+/g, " ")
    //replace .?! with .. (allows me to keep a . at the end of each quote
    .replace(/[\/#.,;!?$%\^&\*:{}=\_`~()]/g, "")

    console.log(context);
    //Call the API with the last message sent
    //To-do use all messages sent instead of the just the lsat one.
    apiCall(context).then(res =>
      this.props.socket.emit("AI message", `Robot from ${this.state.name}`,
        res.replace(/[\r\n]/g, " ")
        .replace(/[\/#.,;!?$%\^&\*:{}=\_`~()]/g, " ")
        .replace(/\s\s+/g, " ").trim())
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
