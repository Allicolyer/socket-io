import React from "react";
import { Message } from "./Message";
import { apiCall } from "../utils/api-call";

export class Chatroom extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "guest", message: "", messages: [] };

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
    //Call the API with the last message sent
    //To-do use all messages sent instead of the just the lsat one.
    apiCall(this.state.messages[last].message).then(res =>
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
  }

  render() {
    return (
      <div>
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
        <form onSubmit={this.handleSubmit}>
          <input
            id="name"
            type="text"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
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
