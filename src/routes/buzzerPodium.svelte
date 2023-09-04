<script lang="ts">
  import type { Socket } from 'socket.io-client'
  import { socket } from '../lib/socket'
  import { browser, dev } from '$app/environment'
  import { gameHash } from '$stores/gameAuthStore'
  import buzzerDescRecords from '$lib/buzzerSet'

  type PodiumItem = Omit<App.BuzzPayload, 'channel'>

  let podium: PodiumItem[] = []

  const placehold = dev && false;
  if (placehold) {
    podium = new Array(5).fill(null).map(() => ({
      user: {
        name: 'a',
        userHash: '',
      },
      sound: Object.keys(buzzerDescRecords)[
        Math.floor(Math.random() * Object.keys(buzzerDescRecords).length)
      ]
    }))
  }

  let podiumHash: string[] = []
  $: podiumInfos = podium.map(p => {
    return {
      buzzer: buzzerDescRecords[p.sound],
      sound: p.sound,
      name: p.user.name
    }
  })

  const onMessage = (message: App.BuzzPayload) => {
    if (dev) console.log(message)
    let userHash = message.user.userHash
    if (!placehold && podiumHash.includes(userHash)) return

    podiumHash = [...podiumHash, userHash]
    podium = [
      ...podium,
      {
        sound: message.sound,
        user: message.user
      }
    ]
  }

  let sock: Socket | undefined
  gameHash.subscribe(hash => {
    if (hash === undefined) return

    if (sock !== undefined) {
      if (dev) console.info('Disconnected from ' + hash)
      sock.disconnect()
      sock = undefined
    }

    if (browser && sock === undefined) {
      if (dev) console.info('Listening on ' + hash)
      sock = socket.on(hash, onMessage)
    }
  })

  const onReset = () => {
    podium = []
    podiumHash = []
  }
</script>

<div class="w-full h-full flex flex-col items-stretch">
  <button class="bg-zinc-800 font-medium text-white p-4 text-center" on:click|preventDefault={onReset}> RESET </button>
  {#if podium.length > 0}
    <div id="podium-container" class="">
      <div id="podium-content" class="flex flex-col items-stretch">
        {#each podiumInfos as { buzzer: { icon, style }, name }, i}
          <div class="podium-item" class:first={i === 0} class:second={i === 1}
          class:third={i === 2} class:odd={i%2 === 1} class:even={i%2 === 0}>
            <div class:icon class={style.class}>
              <svelte:component this={icon} />
            </div><span class="name">{name}</span>
            <div class="position">
              {i+1}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="w-full h-full flex items-center justify-center">READY!</div>
  {/if}
</div>

<style lang="scss">
  #podium-container {
    @apply flex-grow relative;
  }
  #podium-content {
    @apply h-full max-h-full overflow-y-auto absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .podium-item {
    @apply px-4 py-2 flex items-center gap-2;
    @apply text-lg;


    & .icon {
      @apply p-2 mr-2 rounded-full;
    }

    & .name {
      @apply flex-grow;
    }

    & .position {
      @apply text-right;
    }
  }
  .podium-item.even.first {
    @apply bg-amber-600;
  }
  .podium-item.odd.second {
    @apply bg-stone-500;
  }
  .podium-item.even.third {
    @apply bg-orange-800;
  }
  .podium-item.even {
    @apply bg-zinc-800;
  }
</style>
