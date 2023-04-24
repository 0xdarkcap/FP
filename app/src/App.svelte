<script>
  import { onMount } from "svelte";
  import Chat from "./components/Chat.svelte";
  import Users from "./components/Users.svelte";
  import UsernameModal from "./components/UsernameModal.svelte";
  import { socketStore, userList, usrMsg, admin} from "../scripts/stores";
  import { getUsers, registerUsername } from "../scripts/utils";

  let username;
  $: showModal = false;
  let socket;

  function connectWebSocket(url) {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url);

      socket.addEventListener("open", () => {
        resolve(socket);
      });

      socket.addEventListener("error", (error) => {
        reject(error);
      });
    });
  }

  // Update usrMsg store by finding the user with the specified username and appending the message
function updateUserMessages(from, message) {
  usrMsg.update((users) => {
    return users.map((user) => {
      if (user.username === from) {
        if(message.text){
          user.messages.push({ text: message.text, sender: 'uname' });
        }
        if(message.audio){
          user.messages.push({ audio: message.audio, sender: 'uname' });
        }
        if(message.image){
          user.messages.push({ image: message.image, sender: 'uname' });
        }
      }
      return user;
    });
  });
}

  onMount(async () => {
    try {
      const serverUrl = "ws://localhost:3000";
      socket = await connectWebSocket(serverUrl);
      ready = true;
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }

    socketStore.set(socket);

    socketStore.subscribe(($socket) => {
      socket = $socket;

      if (getUsers(socket)) {
        socket.addEventListener("message", (event) => {
          console.log("Message from server: ", event.data);
          const data = JSON.parse(event.data);

          if (data.type == "userList") {
            const result = data.users.map((username, index) => {
              return { id: index + 1, title: username };
            });
            userList.set(result);
            const msg = data.users.map((username) => {
              return { username, messages: [] };
            });
            usrMsg.set(msg);

          }
          if(data.type=="dm"){
            updateUserMessages(data.from, data.message);
          }
        });
      }
    });

    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      username = storedUsername;
      registerUsername(socket, username);
      admin.set(username);
      showModal = false;
    } else {
      showModal = true;
    }
    let users = [];
  });

  function onUsernameSet() {
    username = localStorage.getItem("username");
    admin.set(username);
    showModal = false;
  }
</script>

<main>
  <div class="app-container">
    <Users />
    <div class="chat-container">
      <Chat />
    </div>
    {#if showModal}
      <UsernameModal on:usernameSet={onUsernameSet} />
    {/if}
  </div>
</main>

<style>
  main {
    background-color: #e0e0e0;
  }
  .app-container {
    display: flex;
    height: 100vh;
  }

  .chat-container {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  :global(:root) {
    --cherry: #ff003f;
    --red: #ff5000;
    --red-dim: #e04700;
    --red-dark: #421500;
    --green: #00d604;
    --green-dim: #90ee90;
    --green-dark: #004d01;
    --rich-black: #080808;
    --rich-black-fogra: #0f0f0f;
    --eerie-black: #1a1a1a;
    --jet-dim: #212121;
    --jet: #292929;
    --onyx-dim: #303030;
    --onyx: #3d3d3d;
    --dim-gray: #4a4a4a;
    --sonic-silver: #707070;
    --silver-chalice: #adadad;
    --orange: rgb(253, 167, 20);
    --base-padding: 16px;
    --semi-padding: 8px;
    --base-radius: 4px;
    --chart-resolution-height: 40px;
    --chart-height: 430px;
    --header-height: 60px;
    --ticker-height: 60px;
    --grid-gap: 1px;
  }

  :global(.pos) {
    color: var(--green);
  }
  :global(.neg) {
    color: var(--red);
  }
</style>
