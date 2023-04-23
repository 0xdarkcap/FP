<!-- ChatLog.svelte -->
<script>
  import { createIcon } from '@download/blockies';

  let chatLogs = [
    { id: 1, title: 'Chat 1' },
    { id: 2, title: 'Chat 2' },
    { id: 3, title: 'Chat 3' },
  ];

  let selectedChatId = null;

  function selectChat(chatId) {
    selectedChatId = chatId;
  }

  function generateBlockie(chatTitle) {
    const icon = createIcon({ seed: chatTitle });
    return icon.toDataURL();
  }
</script>

<style>
  .chat-log-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100vh;
    background-color: #0f0f0f;
    display: flex;
    flex-direction: column;
    padding-left:1em ;
    padding-top:2em ;
    align-items: center;
  }

  .chat-log {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    font-size: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    width: 100%;
    transition: transform 0.3s ease;
  }

  .chat-log:hover {
    transform: scale(1.1);
    text-decoration: none;
  }

  .chat-log.selected {
    color: #4a4a4a;
    background-color: #e0e0e0;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    padding-left: 0.3rem;
    
  }

  .chat-log img {
    width: 24px;
    height: 24px;
    border-radius: 3px;
  }
</style>

<div class="chat-log-container">
  {#each chatLogs as chatLog}
    <div
      class="chat-log"
      class:selected="{selectedChatId === chatLog.id}"
      on:click="{() => selectChat(chatLog.id)}"
    >
      <img src="{generateBlockie(chatLog.title)}" alt="blockie" />
      {chatLog.title}
    </div>
  {/each}
</div>
