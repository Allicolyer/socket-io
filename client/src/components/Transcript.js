import React from "react";

export default class Transcript extends React.Component {
  render() {
    return <div className="transcript">{this.props.context}</div>;
  }
}
