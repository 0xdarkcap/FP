<!-- Chat.svelte -->
<script>
  import { onMount } from "svelte";
  import {
    selectedChat,
    usrMsg,
    admin,
    socketStore,
  } from "../../scripts/stores";
  import { sendmsg } from "../../scripts/utils";
  import RecordRTC from "recordrtc";

  let inputMessage = "";
  let user = null;
  let chatWindow;
  let targetUsername = null;
  let socket;

  async function toggleRecording() {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  // Add these variables at the beginning of the <script> section
  let mediaRecorder;
  let audioChunks = [];
  let isRecording = false;

  async function startRecording() {
    if (!isRecording) {
      isRecording = true;

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder = RecordRTC(mediaStream, {
        type: "audio",
        mimeType: "audio/wav",
      });

      mediaRecorder.startRecording();
    }
  }

  async function stopRecording() {
    if (isRecording && mediaRecorder) {
      isRecording = false;

      mediaRecorder.stopRecording(async () => {
        const audioBlob = mediaRecorder.getBlob();
        sendVoiceMessage(audioBlob);
        mediaRecorder.reset();
      });
    }
  }
  // Add these functions in the <script> section
  /*async function startRecording() {
    if (!isRecording) {
      isRecording = true;
      audioChunks = [];

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      // Add this event listener
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        sendVoiceMessage(audioBlob);
      });

      mediaRecorder.start();
    }
  }

  async function stopRecording() {
    if (isRecording && mediaRecorder) {
      isRecording = false;
      mediaRecorder.stop(); // No need to call sendVoiceMessage here
    }
  }*/

  let imageFiles = [];

  let inputElement;

  async function sendImage() {
    if (imageFiles && imageFiles.length > 0) {
      const file = imageFiles[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64Image = event.target.result;
        socketStore.subscribe(($socket) => {
        socket = $socket;
        sendmsg(socket, user.username, me, {
          image: base64Image,
          sender: "uname",
        });
        updateMessageArray(user.username, {
          image: base64Image,
          sender: "user",
        });
        scrollToBottom();
      });
    };

      reader.readAsDataURL(file);
    }
  }

  async function sendVoiceMessage(audioBlob) {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64Audio = reader.result;

      socketStore.subscribe(($socket) => {
        socket = $socket;
        if (
          sendmsg(socket, user.username, me, {
            audio: base64Audio,
            sender: "uname",
          })
        ) {
          updateMessageArray(user.username, {
            audio: base64Audio,
            sender: "user",
          });
        }
      });

      scrollToBottom();
    };
  }

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
        if (
          sendmsg(socket, user.username, me, {
            text: inputMessage,
            sender: "uname",
          })
        ) {
          updateMessageArray(user.username, {
            text: inputMessage,
            sender: "user",
          });
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
          <!-- Replace the existing {message.text} line with the following -->
          {#if message.text}
            {message.text}
          {:else if message.audio}
            <audio controls src={message.audio} />
          {:else if message.image}
            <img src={message.image} class="message-image" />
          {/if}
        </div>
      {/each}
    </div>
    <div class="input-container">
      <!-- Add this inside the .input-container div -->
      <!-- Replace the existing Record and Stop buttons with this -->
      <button
        on:click={toggleRecording}
        class="mic-btn"
        class:recording={isRecording}
      >
        🎤
      </button>
      <!-- Add this inside the .input-container div -->
      <input
        type="file"
        accept="image/*"
        bind:this={inputElement}
        bind:files={imageFiles}
        class="image-input"
        on:change={sendImage}
      />
      <button on:click={() => inputElement.click()} class="send-image-btn">
        📎
      </button>

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
  /* Add to the <style> section */
  /* Add to the <style> section */
  .image-input {
    display: none;
  }

  .send-image-btn {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 5px;
    margin-left: 0.5rem;
    cursor: pointer;
  }
  /* Add to the <style> section */
  .message-image {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 5px;
  }

  .mic-btn {
    background-color: silver;
    margin-left: 0.5rem;
    transition: background-color 0.3s ease;
  }

  .mic-btn.recording {
    background-color: #4caf50;
  }

  .input-message {
    flex: 1;
    padding: 0.5rem;
    padding-left: 0.5cm;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  /* Add to the <style> section */
  .record-btn,
  .stop-btn {
    background-color: #f44336;
    margin-left: 0.5rem;
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
