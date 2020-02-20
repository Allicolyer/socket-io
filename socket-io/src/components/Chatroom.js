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

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({messages: [...this.state.messages, {name: this.state.name, message: this.state.message, isCurrentUser: true}]});
    // const m = React.createElement("Message", {name: this.state.name, message: this.state.message, isCurrentUser: true});

    // ReactDOM.render(m, document.getElementById('messages'));
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
