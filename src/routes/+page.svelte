<script lang="ts">
  import LoginForm from '$components/userForm.svelte'
  import GameForm from '$components/gameForm.svelte'
  import BulhormVariant from 'svelte-material-icons/BullhornVariant.svelte'

  import { socket } from '../lib/socket'
  import { isConnectedToGame, isHostingGame, isInGame, gameHash } from '$stores/gameAuthStore'
  import { authStore, userHash } from '$stores/userAuthStore'
  import Buzzers from './buzzers.svelte'
  import { isloggedIn } from '$stores/userAuthStore'
  import BuzzerPodium from './buzzerPodium.svelte'

  const onBuzz = (sound: string) => {
    const payload: App.BuzzPayload = {
      sound,
      channel: $gameHash || '',
      user: {
        name: $authStore.name,
        userHash: $userHash
      }
    }
    socket.emit('message', payload)
  }
</script>

<div id="app" class="h-full w-full max-w-md overflow-y-auto bg-zinc-700 text-white flex flex-col">
  <header class="text-2xl leading-none font-medium p-2 text-white flex items-center gap-2">
    <span class="rounded-lg bg-zinc-800 text-white p-2">
      <BulhormVariant size="20" />
    </span><span class="flex-grow my-2">Buzzer App</span>
  </header>
  <div class="border-b border-zinc-800" />
  <LoginForm />
  <div class="border-b border-zinc-800" />
  <GameForm />
  <div class="border-b border-zinc-800" />

  <div id="content" class="flex-grow">
    {#if $isloggedIn && $isInGame}
      {#if $isConnectedToGame}
        <Buzzers on:buzz={evt => onBuzz(evt.detail)} />
      {:else if $isHostingGame}
        <BuzzerPodium />
      {/if}
    {:else}
      <div class="w-full h-full bg-zinc-800" />
    {/if}
  </div>
</div>

<style lang="scss">
  #app {
    margin: 0 auto;
  }
</style>
