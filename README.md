# Ai(M)

Ai(M) lets you write a story with a GPT-2 bot. There are four different themed chatrooms that you can enter. Each time you add a line to the story, you'll get a response from a bot using the GPT-2 machine learning model. Together you and your friends can write a fun and bizarre story.

## Overview

### Tech Stack

- [Socket.io](https://socket.io/) - used to create a WebSocket
- Express and Node - used for the socket.io server
- React - used to create the chatroom client

### Socket.io Server
Ai(M) uses socket.io to create a WebSocket. Messages from clients are sent through the WebSocket and emitted to other clients in the room. The server also keeps track of the transcript, or story for each chatroom.

Events on the client-side trigger the following actions from the socket.io server:

 - connectClient: a new client connects the server
 - chatMessage: sends a chat message initiated by one client to all other clients in the chatroom
 - aiMessage: sends an AI message initiated by one client to all other clients in a chat room
 - updateTranscript: updates the transcript for a chatroom with new messages from clients or AI
 - resetTranscript: resets the transcript back to the original text
 - changeRoom: lets the client change room
 - disconnectClient: a client disconnects from the server

### React Client
The client-side chatroom is built using React. The client connects to the socket server using a client-side socket.io library. The React chatroom component updates the client's current room, messages, and transcript each time they are relayed from the server.

### GPT-2 API
GPT-2 is a machine learning model created by [openai](https://openai.com/blog/better-language-models/) that generates realistic sounding text.

We used the [transformer library from hugging face](https://huggingface.co/transformers/) to create a flask app that serves up a GPT-2 endpoint. The endpoint takes a POST request with the contents of the transcript and returns the next line in the story. Here is our [Github repository for the flask app](https://github.com/Allicolyer/gpt-2-flask).

## Ai(M) Team

<table>
  <tr>
    <td align="center"><a href="https://github.com/hwacha"><img src="https://avatars3.githubusercontent.com/u/6621013?s=400&u=7f29bc3b3c2461a57c9a3ccc912d73a6f8e21e86&v=4" width="200px;" alt="Picture of Bill Marcy"/><br /><b>Bill Marcy</b></a></td>
    <td align="center"><a href="https://github.com/allicolyer"><img src="https://avatars1.githubusercontent.com/u/11083917?s=460&v=4" width="200px;" alt="Picture of Allison Colyer"/><br /><b>Alli Colyer</b></a></td>
    <td align="center"><a href="https://github.com/msmedes"><img src="https://avatars1.githubusercontent.com/u/26441721?s=460&v=4" width="200px;" alt="Picture of Mike Smedes"/><br /><b>Mike Smedes</b></a></td>
  </tr>
</table>

