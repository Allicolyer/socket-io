import React from "react";

export default class StoryWindow extends React.Component {
   render() {
    return (
            <div className="story">{this.props.context}</div>
           )
      }
}