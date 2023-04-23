<!-- UsernameModal.svelte -->
<script>
  import { createEventDispatcher } from "svelte";
  import { jsonToBinary, binaryToJson } from "./../../scripts/utils";

  const dispatch = createEventDispatcher();

  let username = "";

  async function submitUsername() {
    const socket = new WebSocket("ws://localhost:8080/chat");
    socket.binaryType = "arraybuffer";
    
    // Listen for messages
    socket.addEventListener("message", (event) => {
      if (event.data instanceof ArrayBuffer) {
        // binary frame
        const view = new DataView(event.data);
        console.log(view.getInt32(0));
      } else {
        // text frame
        console.log(event.data);
      }
    });
    // Change binary type from "blob" to "arraybuffer"

    /*    //const socket = new WebSocket('wss://echo.websocket.org');

    
    const socket = new WebSocket('ws://localhost:8080/chat');
    socket.binaryType = "arraybuffer";
      console.log(jsonToBinary(JSON.stringify({ action: 'setUsername', username })))
      socket.onopen = () => {
        socket.send(jsonToBinary(JSON.stringify({ action: 'setUsername', username })));
      };
  
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
  
        if (data.status === 'success') {
          localStorage.setItem('username', username);
          socket.close();
          dispatch('usernameSet');
        } else {
          console.error('Error setting username:', data.message);
        }
      };
  
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };*/
  }
</script>

<div class="overlay" />
<div class="modal">
  <h2>Choose a username</h2>
  <input type="text" bind:value={username} placeholder="Username" />
  <button on:click={submitUsername}>Submit</button>
</div>

<style>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
  }
</style>
