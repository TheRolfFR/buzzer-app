<script lang="ts">
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import { slide } from 'svelte/transition'

  import { isGameMaster } from '$stores/userAuthStore'
  import { EMPTY_GAME_AUTH, gameAuthStore, type GameAuth, gameStatusStore, GameStatus, generateQRCodeURL } from '$stores/gameAuthStore'

  import { generate } from '$lib/generatePassPhrase'
  import wordFile from '$lib/words.txt?raw'
  import Sync from 'svelte-material-icons/Sync.svelte'

  import ShareIcon from 'svelte-material-icons/Share.svelte'
  import { page } from '$app/stores'
  import { browser, dev } from '$app/environment'
  import QRCode from 'qrcode'

  if ($page.url.searchParams.get('game') !== null && $page.url.searchParams.get('pass') !== null) {
    gameAuthStore.set({
      name: $page.url.searchParams.get('game') || '',
      passcode: $page.url.searchParams.get('pass') || ''
    })

    if (browser) {
      let newUrl = new URL($page.url)
      newUrl.searchParams.delete('game')
      newUrl.searchParams.delete('pass')
      window.location.href = newUrl.toString()
    }
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

  let qrCodeUrl: string | undefined = undefined
  let showQrCode = false
  let lastQRData = ''
  const generateQrCode = () => {
    showQrCode = !showQrCode
    if (!showQrCode) return

    const qrData = generateQRCodeURL($page.url.href, $gameAuthStore)
    lastQRData = qrData

    qrCodeUrl = undefined
    QRCode.toDataURL(qrData)
      .then((url: string) => {
        qrCodeUrl = url
      })
      .catch(() => {})
  }
  $: qrCodeClasses = showQrCode ? 'bg-white text-zinc-800' : 'bg-zinc-800 text-white'

  $: webShareAPISupported = browser && typeof navigator.share !== 'undefined'
  $: onShare = async () => {
    try {
      navigator.share({
        title: 'Buzzer app',
        text: `Shared from`,
        url: lastQRData || ''
      })
    } catch (error) {
      webShareAPISupported = false
    }
  }
  $: cantShare = !webShareAPISupported

  const onSubmit = () => {
    gameAuthStore.set(inputForm)
  }

  const onReset = () => {
    gameAuthStore.set(EMPTY_GAME_AUTH)
  }

  const toggleQrCode = () => {
    generateQrCode()
  }
  if (dev) toggleQrCode() // open qr code panel by default
</script>

<div class="px-4 py-2 text-white">
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
    {#if showQrCode && qrCodeUrl}
      <div transition:slide class="flex items-stretch gap-2 text-center py-2">
        <div style:width="150px" class="aspect-square">
          <img src={qrCodeUrl} alt="QRCode" class="rounded rounded-lg" />
        </div>
        <div style:height="150px" class="text-sm flex flex-col flex-grow gap-2">
          <a href={lastQRData} target="_blank" rel="noreferrer" class="bg-zinc-800 rounded rounded-lg p-2 underline flex-grow flex items-center justify-center">
            {lastQRData.substring(0, lastQRData.indexOf('?'))}<br />{lastQRData.substring(lastQRData.indexOf('?'))}
          </a>
          <button style:display={cantShare ? 'none' : ''} on:click|preventDefault={onShare} class="bg-zinc-800 rounded rounded-lg p-2 flex items-center justify-center gap-2 text-xl">
            <span class="flex items-center gap-1"><ShareIcon /> <span>Share</span></span>
          </button>
        </div>
      </div>
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
