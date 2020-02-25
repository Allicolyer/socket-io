import React from "react";
import { Message } from "./Message";
import Modal from "./Modal";

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
    socket.on("chat message", (name, message) => {
      this.addMessage(name, message, false);
      this.playAudio("./audio/incoming-message.mp3");
    });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  addMessage(name, message, isCurrentUser) {
    this.setState({
      messages: [
        ...this.state.messages,
        { name: name, message: message, isCurrentUser: isCurrentUser }
      ]
    });
  }

  playAudio(file) {
    console.log("I lovem music");
    let audio = new Audio(file);
    console.log(audio);
    audio.play();
  }

  handleSubmit(event) {
    event.preventDefault();
    this.addMessage(this.state.name, this.state.message, true);
    this.playAudio("./audio/outgoing-message.wav");
    this.props.socket.emit("chat message", this.state.name, this.state.message);
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
