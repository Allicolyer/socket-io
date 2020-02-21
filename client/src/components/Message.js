import React, { Component } from "react"

export const Message = ({name, message, isCurrentUser}) => {
  return (
    <li className={isCurrentUser ? 'current-user' : ''}>
    <span className='name'>{name}:</span> {message}
    </li>
  );
}
