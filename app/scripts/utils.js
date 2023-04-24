
import { socketStore } from '../scripts/stores';

export function sendmsg(socket, to, from, message){
  socket.send(JSON.stringify({ type: 'dm' , to:to, from:from, message:message}));
  return true;
}
export function getUsers(socket){
 
  socket.send(JSON.stringify({ type: 'getUsers' }));
  return true;
}
export function registerUsername(socket,username){
  socket.send(JSON.stringify({ type: "register", username: username }));
  return true;
}

export function handleEvent(){
  
  socketStore.subscribe((socket) => {
    if (socket) {
      // Connection opened
  console.log(socket);
  socket.addEventListener("open", (event) => {
    // Register the user
    socket.send(JSON.stringify({ type: "register", username: username }));
  });

  // Listen for messages
  socket.addEventListener("message", (event) => {
    console.log("Message from server: ", event.data);
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "registration":
        if (data.status === "success") {
          localStorage.setItem("username", username);
        } else {
          console.error("Error setting username:", data.message);
        }
        break;
      case "userList":
        // Handle user list response
        break;
      case "dm":
        // Handle direct message
        break;
      case "groupchat":
        // Handle group chat message
        break;
      case "error":
        // Handle errors
        break;
      default:
        console.log("Unknown message type:", data.type);
    }
  });

  // Connection closed
  socket.addEventListener("close", (event) => {
    console.log("Server disconnected:", event);
  });

  // Connection error
  socket.addEventListener("error", (event) => {
    console.log("WebSocket error:", event);
  });
    }
  });
  
}

export function sendMessage(socket, message) {
  socket.send(JSON.stringify(message));
}