<script lang="ts">
  import BuzzerButton from './buzzerButton.svelte'
  import { createStore } from '$lib/createStore'
  import { createEventDispatcher } from 'svelte'
  import buzzerDescRecords from '$lib/buzzerSet'

  let lastSoundWritable = createStore(
    'LAST_SOUND',
    undefined, // default value
    s => (s === 'undefined' ? undefined : s), // parse
    w => w, // transform
    v => String(v) // serialize
  )
  $: lastIconSet = typeof $lastSoundWritable !== 'undefined' ? buzzerDescRecords[$lastSoundWritable] || undefined : undefined

  const audioSourceElements: Record<string, HTMLAudioElement> = {}
  const onClick = (dispName: string) => {
    lastSoundWritable.set(dispName)

    Object.values(audioSourceElements).forEach(audioEl => {
      audioEl.pause()
      audioEl.currentTime = 0
    })

    const foundEl = audioSourceElements[dispName]
    foundEl.play()

    sendBuzz(dispName)
  }

  const dispatch = createEventDispatcher()
  const sendBuzz = (sound: string) => {
    dispatch('buzz', sound)
  }

  const lastOnClick = () => {
    if ($lastSoundWritable === undefined) return
    onClick($lastSoundWritable)
  }
</script>

<div id="buzzers" class="w-full h-full flex flex-col px-4 py-2 gap-2">
  {#if lastIconSet !== undefined}
    <button class="py-2 active:pt-3 active:pb-1 grid-cell flex flex-col items-center justify-center" on:click={lastOnClick}>
      <BuzzerButton {...lastIconSet.style} big nolabel>
        <svelte:component this={lastIconSet.icon} class="opacity-70" />
      </BuzzerButton>
    </button>
  {/if}
  <div id="buzzer-grid" class={'grid gap-2 flex-grow ' + (lastIconSet ? 'grid-cols-3' : 'grid-cols-2')}>
    {#each Object.entries(buzzerDescRecords) as [displayName, buzzerDesc]}
      <button class="py-2 active:pt-3 active:pb-1 grid-cell flex flex-col items-center justify-center" on:click={() => onClick(displayName)}>
        <BuzzerButton {...buzzerDesc.style}>
          <svelte:component this={buzzerDesc.icon} class="opacity-70" />
        </BuzzerButton>
        <audio src={buzzerDesc.audio.path} bind:this={audioSourceElements[displayName]} preload="auto" />
      </button>
    {/each}
  </div>
</div>
