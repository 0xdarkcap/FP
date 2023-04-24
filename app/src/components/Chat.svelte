<!-- Chat.svelte -->
<script>
  import { onMount } from "svelte";
  import { selectedChat, usrMsg, admin, socketStore } from "../../scripts/stores";
  import {sendmsg} from '../../scripts/utils';
  let inputMessage = "";
  let user = null;
  let chatWindow;
  let targetUsername = null;
  let socket;

  selectedChat.subscribe(($selectedChat) => {
    if ($selectedChat != null) {
      targetUsername = $selectedChat.user;
    }
  });

  $: {
    user = $usrMsg.find((usr) => usr.username === targetUsername);
    if (user) {
      console.log("User's messages:", user.messages);
    }
  }

  let me;
  const unsubscribe = admin.subscribe(($admin) => {
    me = $admin;
  });

  function updateMessageArray(username, newMessage) {
    usrMsg.update((users) => {
      return users.map((user) => {
        if (user.username === username) {
          user.messages.push(newMessage);
        }
        return user;
      });
    });
  }

  function sendMessage() {
    if (inputMessage.trim() !== "") {
      socketStore.subscribe(($socket) => {
        socket = $socket;
        if (sendmsg(socket, user.username, me, {text:inputMessage, sender:"uname"})) {
          updateMessageArray(user.username, { text: inputMessage, sender: "user" });
        }
      });
      
      scrollToBottom();
      /* use spread operator to create a new array
      // Simulate ChatGPT response after user sends a message
      setTimeout(() => {
        updateMessageArray(user.username, {
          text: "One night I dreamed a dream. I was walking along the beach with my Lord Akhil. Across the dark sky flashed scenes from my life. For each scene, I noticed two sets of footprints in the sand, one belonging to me and one to my Lord Akhil.",
          sender: "uname",
        }); // use spread operator to create a new array

        scrollToBottom();
      }, 1000);
      scrollToBottom();*/
    }
    inputMessage = "";
  }

  function scrollToBottom() {
    if (chatWindow) {
      chatWindow.scrollTo({
        top: chatWindow.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  onMount(() => {
    scrollToBottom();
  });
</script>

{#if user == null}
  <div>select a chat first</div>
{:else}
  <div class="chat-container">
    <div class="chat-window" bind:this={chatWindow}>
      {#each user.messages as message}
        <div
          class="message"
          class:user={message.sender === "user"}
          class:chatgpt={message.sender === "uname"}
        >
          {message.text}
        </div>
      {/each}
    </div>
    <div class="input-container">
      <input
        class="input-message"
        type="text"
        placeholder="Type your message here..."
        bind:value={inputMessage}
        on:keyup={(e) => e.key === "Enter" && sendMessage()}
      />
      <button on:click={sendMessage}>Send</button>
    </div>
  </div>
{/if}

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin-left: 280px;
  }

  .chat-window {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    background-color: #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .message {
    padding: 0.5rem;
    border-radius: 5px;
    max-width: 60%;
    font-size: 1rem;
  }

  .message.user {
    align-self: flex-end;
    background-color: #4a4a4a;
    color: white;
  }

  .message.chatgpt {
    align-self: flex-start;
    background-color: var(--green-dim);
  }

  .input-container {
    display: flex;
    padding: 1rem;
  }

  .input-message {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 5px;
    margin-left: 0.5rem;
    cursor: pointer;
  }
</style>
