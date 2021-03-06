import React from "react";
import io from "socket.io-client";
import { Chatroom } from "./Chatroom";
import socketCallback from "../utils/enums";


const socketUrl = "http://localhost:4000/";
export class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  initSocket = () => {
    const socket = io(socketUrl);

    socket.on(socketCallback.connectClient, () => {
      console.log("Connected");
    });

    this.setState({ socket });
  };

  render() {
    const { socket } = this.state;
    return <Chatroom socket={socket} />;
  }
}
