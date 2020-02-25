import React from "react";

export default class Transcript extends React.Component {
  render() {
    return (
      <div className="transcript">
        {this.props.context && <h2> Transcript</h2>}
        <div>{this.props.context}</div>
      </div>
    );
  }
}
