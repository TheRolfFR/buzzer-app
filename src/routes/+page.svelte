<script lang="ts">
  import LoginForm from '$components/userForm.svelte'
  import GameForm from '$components/gameForm.svelte'
  import BulhormVariant from 'svelte-material-icons/BullhornVariant.svelte'

  import { socket } from '$lib/socket.client'
  import { isConnectedToGame, isHostingGame, isInGame, gameHash } from '$stores/gameAuthStore'
  import { authStore, userHash } from '$stores/userAuthStore'
  import Buzzers from './buzzerGrid.svelte'
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

<div id="app">
  <header>
    <span id="logo">
      <BulhormVariant size="20" />
    </span><span class="flex-grow my-2">Buzzer App</span>
  </header>
  <div class="hr" />
  <LoginForm />
  <div class="hr" />
  <GameForm />
  <div class="hr" />

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
    @include bg;
    @include s-full;
    @apply max-w-md overflow-y-auto flex flex-col;
    margin: 0 auto;
  }

  header {
    @include flex-middle;
    @apply text-2xl leading-none font-medium p-2;
  }

  #logo {
    @include bg-darker;
    @apply rounded-lg p-2;
  }

  .hr {
    @apply border-b border-zinc-800;
  }
</style>
