<!-- UsernameModal.svelte -->
<script>
  import {socketStore} from '../../scripts/stores'
  import { registerUsername } from "../../scripts/utils";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let username = "";
  let socket;
  

  async function submitUsername() {
    
  socketStore.subscribe(($socket) => {
    socket = $socket;
    if(registerUsername(socket,username)){
      dispatch("usernameSet");
    }
  });
    socket.addEventListener("message", (event) => {
      console.log("Message from server: ", event.data);
      const data = JSON.parse(event.data);
      if(data.type=='registration'){
        if (data.status === "success") {
          localStorage.setItem("username", username);
        } else {
          console.error("Error setting username:", data.message);
        }
      }
  });
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
