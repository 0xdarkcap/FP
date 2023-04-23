<script>
	import {onMount} from 'svelte';
	import Chat from './components/Chat.svelte'
	import Users from './components/Users.svelte';
	import UsernameModal from './components/UsernameModal.svelte';

  let username;
  let showModal = true;

  onMount(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      username = storedUsername;
      showModal = false;
    }
  });

  function onUsernameSet() {
    username = localStorage.getItem('username');
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
    <UsernameModal on:usernameSet="{onUsernameSet}" />
  {/if}
	</div>
	
</main>

<style>
main{
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