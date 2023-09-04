<script lang="ts">
  import { EMPTY_USER_AUTH, authStore, isloggedIn, type Auth } from '$stores/userAuthStore'
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'

  let loginForm: Auth = { ...EMPTY_USER_AUTH }
  onMount(() => {
    loginForm = get(authStore)
  })

  const onLogin = () => {
    authStore.set(loginForm)
  }

  const onReset = () => {
    authStore.set(EMPTY_USER_AUTH)
  }
</script>

<div class="app-section">
  <h3 class="font-medium text-sm opacity-70">1. Identity</h3>
  {#if $isloggedIn}
    <div class="flex justify-between items-center gap-2">
      <div class="flex-grow">
        <span class="opacity-70">Logged in as </span>
        <span class="font-bold">{$authStore.name}</span>
        <span class="opacity-70"> as a </span>
        <span class="font-bold">{$authStore.gameMaster ? 'Game master' : 'Player'}</span>
      </div>
      <button class="px-2 py-1 shrink-0 bg-zinc-800 text-white rounded" on:click|preventDefault={onReset}>Logout</button>
    </div>
  {:else}
    <form action="#" on:submit|preventDefault={onLogin}>
      <input required type="text" bind:value={loginForm.name} placeholder="Enter name" class="bg-transparent border block border-zinc-800 px-2 py-1 my-2 rounded w-full" />
      <input required type="password" bind:value={loginForm.password} placeholder="Enter password" class="bg-transparent border block border-zinc-800 px-2 py-1 my-2 rounded w-full" />
      <div class="my-2 flex items-center grow gap-2 justify-between">
        <label for="SetAsGameMaster" class="px-2 py-1 border rounded border-zinc-800 flex items-center gap-2">
          <input type="checkbox" bind:checked={loginForm.gameMaster} id="SetAsGameMaster" />
          <span class="select-none">Game master</span>
        </label>
        <button class="shrink-0 px-2 py-1 bg-zinc-800 text-white rounded" type="submit">Login</button>
      </div>
    </form>
  {/if}
</div>
