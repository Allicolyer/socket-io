import React, { Component } from "react"
import ReactDOM from "react-dom"
import { Message } from "./Message"

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
    socket.on("chat message", (name, message) => this.addMessage(name, message, false));
    console.log(socket);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  addMessage(name, message, isCurrentUser) {
    this.setState({messages: [...this.state.messages, {name: name, message: message, isCurrentUser: isCurrentUser}]});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.addMessage(this.state.name, this.state.message, true);
    this.props.socket.emit("chat message", this.state.name, this.state.message);
  }

  render() {
    return (
      <div>
        <ul id="messages">{
          this.state.messages.map((m, i) =>
            <Message key={i} name={m.name} message={m.message} isCurrentUser={m.isCurrentUser}/>)
        }
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
