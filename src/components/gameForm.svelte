<script lang="ts">
  import { onMount } from 'svelte'
  import { derived, get } from 'svelte/store'

  import { isGameMaster } from '$stores/userAuthStore'
  import { EMPTY_GAME_AUTH, gameAuthStore, type GameAuth, gameStatusStore, GameStatus, generateQRCodeURL } from '$stores/gameAuthStore'

  import { generate } from '$lib/generatePassPhrase'
  import wordFile from '$lib/words.txt?raw'
  import Sync from 'svelte-material-icons/Sync.svelte'

  import ShareIcon from 'svelte-material-icons/Share.svelte'
  import { page } from '$app/stores'
  //? keep dev for commented line
  import { browser, dev } from '$app/environment'
  import QrCodePane from './qrCodePane.svelte'
  import { extractParams, cleanUrl, createUrl } from '$lib/qrCode'

  const extracted = extractParams($page.url)
  if (extracted !== undefined && browser) {
    gameAuthStore.set(extracted)

    window.location.href = cleanUrl($page.url).href
  }

  const WORD_LIST = wordFile.split('\n').filter(word => word.length <= 6)

  let inputForm: GameAuth = { ...EMPTY_GAME_AUTH }
  onMount(() => {
    gameAuthStore
    inputForm = get(gameAuthStore)
  })

  const generateNewPasscode = () => {
    inputForm.passcode = generate({
      fast: true,
      numbers: false,
      length: 3,
      words: WORD_LIST
    })
  }

  let showQrCode = false
  $: qrCodeUrl = derived(gameAuthStore, gameAuth => createUrl($page.url, gameAuth).toString())
  $: qrCodeClasses = showQrCode ? 'bg-white text-zinc-800' : 'bg-zinc-800 text-white'

  const onSubmit = () => {
    gameAuthStore.set(inputForm)
  }

  const onReset = () => {
    gameAuthStore.set(EMPTY_GAME_AUTH)
  }

  const toggleQrCode = () => {
    showQrCode = !showQrCode
  }
  // if (dev) toggleQrCode() // open qr code panel by default
</script>

<div class="app-section">
  <h3 class="font-medium text-sm opacity-70">2. Game</h3>
  {#if $gameStatusStore == GameStatus.HOSTING || $gameStatusStore == GameStatus.CONNECTED}
    <div class="flex justify-between items-center gap-2">
      <div class="flex-grow">
        <span class="font-bold">{$gameStatusStore == GameStatus.HOSTING ? 'Hosting' : 'Connected'}</span>
        <span class="opacity-70">{$gameStatusStore == GameStatus.HOSTING ? ' game ' : ' to game '}</span>
        <span class="font-bold">{$gameAuthStore.name}</span>
        <span class="opacity-70"> with passphrase </span>
        <span class="font-bold">{$gameAuthStore.passcode}</span>
      </div>
      <button on:click={toggleQrCode} class={'px-2 py-1 shrink-0 rounded aspect-square ' + qrCodeClasses}> <ShareIcon /> </button>
      <button on:click={onReset} class="px-2 py-1 shrink-0 bg-zinc-800 text-white rounded"> Disconnect </button>
    </div>
    {#if showQrCode}
      <QrCodePane qrData={$qrCodeUrl} />
    {/if}
  {:else}
    <form action="#" on:submit|preventDefault={onSubmit}>
      <input type="text" required bind:value={inputForm.name} placeholder="Enter game name" class="bg-transparent border block border-zinc-800 px-2 py-1 my-2 rounded w-full" />
      <div class="my-2 flex items-center grow gap-2">
        <input type="text" bind:value={inputForm.passcode} placeholder="Enter game passphrase" class="bg-transparent border block border-zinc-800 px-2 py-1 rounded flex-grow" />
        {#if $isGameMaster}
          <button on:click|preventDefault={generateNewPasscode} class="px-2 py-1 shrink-0 bg-zinc-800 text-white rounded">
            <Sync class="inline-block align-middle" />
            <span class="inline-block align-middle">Generate</span>
          </button>
        {/if}
      </div>
      <div class="my-2 flex justify-end grow gap-2">
        <input type="submit" value={$isGameMaster ? 'Host' : 'Connect'} class="px-2 py-1 shrink-0 bg-zinc-800 text-white rounded" />
      </div>
    </form>
  {/if}
</div>
