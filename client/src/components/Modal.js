import React from "react";

export default class Modal extends React.Component {
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="modal-container">
        <div className="modal" id="modal">
          <h2>{this.props.header}</h2>
          <div className="modal-content">{this.props.children}</div>
          <div className="actions">
            <button className="button toggle-button" onClick={this.onClose}>
              close
            </button>
          </div>
        </div>
      </div>
    );
  }
}
