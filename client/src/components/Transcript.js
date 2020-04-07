import React from "react";

export default class Transcript extends React.Component {
  render() {
    return (
      <div className="transcript-container card margin-y">
        <h2 className="title margin-y"> Transcript</h2>
        {this.props.context && (
          <div className="main-text margin-y">{this.props.context}</div>
        )}
      </div>
    );
  }
}
