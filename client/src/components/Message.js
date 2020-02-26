import React from "react";

export const Message = ({ name, message, isCurrentUser }) => {
  return (
    <li>
      <span className={isCurrentUser ? "name current-user" : "name"}>
        {name}:{" "}
      </span>
      {message}
    </li>
  );
};
