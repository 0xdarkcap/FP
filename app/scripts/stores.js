import { writable, derived } from 'svelte/store';

export const admin = writable(null);

export const socketStore = writable(null);

export let userList = writable([]);

export let selectedChat = writable(null);

export let usrMsg = writable([]);