<script lang="ts">
  import defaultIcon from 'svelte-material-icons/VolumeHigh.svelte'
  import boing from 'svelte-material-icons/Kangaroo.svelte'
  import buzz from 'svelte-material-icons/BullhornVariant.svelte'
  import cow from 'svelte-material-icons/Cow.svelte'
  import duck from 'svelte-material-icons/Duck.svelte'
  import horn from 'svelte-material-icons/Bugle.svelte'
  import siren from 'svelte-material-icons/AlarmLight.svelte'
  import BuzzerButton from './buzzerButton.svelte'
  import { createStore } from '$lib/createStore'

  const soundRecords = import.meta.glob('$static/sounds/*')
  const soundPaths = Object.keys(soundRecords)
  const publicPaths = soundPaths.map(p => p.replace('/static', ''))

  interface BuzzeProperties {
    label: string
    class: string
  }
  interface AudioSource {
    path: string
    displayName: string
  }
  interface BuzzerDescription {
    style: BuzzeProperties
    icon: typeof defaultIcon
    audio: AudioSource
  }

  const icons = [boing, buzz, cow, duck, horn, siren]
  const colors = ['bg-green-600', 'bg-red-600', 'bg-orange-600', 'bg-blue-600', 'bg-yellow-600', 'bg-purple-600']
  const shadows = ['shadow-green-600/50', 'shadow-red-600/50', 'shadow-orange-600/50', 'shadow-blue-600/50', 'shadow-yellow-600/50', 'shadow-purple-600/50']

  const iconColors = colors.map((c, i) => [c, icons[i] || defaultIcon, shadows[i]] as [string, (typeof icons)[number], string])
  const DEFAULT_STYLE_SET = ['bg-grey-600', defaultIcon, 'shadow-grey-600/50'] as (typeof iconColors)[number]

  const buzzerDescRecords = publicPaths.reduce((acc, cur, i) => {
    const displayName = cur.split('/').pop()?.split('.').shift() || ''
    const styleSet = iconColors[i] || DEFAULT_STYLE_SET
    acc[displayName] = {
      style: {
        label: displayName,
        class: `${styleSet[0]} ${styleSet[2]}`
      },
      icon: styleSet[1],
      audio: {
        path: cur,
        displayName
      }
    }

    return acc
  }, {} as Record<string, BuzzerDescription>)

  let lastSoundWritable = createStore(
    'LAST_SOUND',
    undefined,
    s => (s === 'undefined' ? undefined : s),
    w => w
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
  }

  const lastOnClick = () => {
    if ($lastSoundWritable === undefined) return
    onClick($lastSoundWritable)
  }
</script>

<div id="buzzers" class="w-full h-full flex flex-col py-2 gap-2">
  {#if lastIconSet !== undefined}
    <button class="py-2 active:pt-3 active:pb-1 grid-cell flex flex-col items-center justify-center" on:click={lastOnClick}>
      <BuzzerButton {...lastIconSet.style} big nolabel>
        <svelte:component this={lastIconSet.icon} class="opacity-70" />
      </BuzzerButton>
    </button>
  {/if}
  <div id="buzzer-grid" class={'grid px-4 gap-2 flex-grow ' + (lastIconSet ? 'grid-cols-3' : 'grid-cols-2')}>
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
