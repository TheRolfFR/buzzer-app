<script lang="ts">
  import { isGameMaster } from '$stores/userAuthStore'
  import { EMPTY_GAME_AUTH, gameAuthStore, type GameAuth, gameStatusStore, GameStatus, generateQRData } from '$stores/gameAuthStore'
  import { generate } from '$lib/generatePassPhrase'
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import wordFile from '$lib/words.txt?raw'
  import Sync from 'svelte-material-icons/Sync.svelte'
  import QrCodeIcon from 'svelte-material-icons/Qrcode.svelte'
  import QRCode from 'qrcode'
  import { page } from '$app/stores'

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

    const qrData = generateQRData($page.url.href, $gameAuthStore)
    if (lastQRData === qrData) return
    lastQRData = qrData

    qrCodeUrl = undefined
    QRCode.toDataURL(qrData)
      .then((url: string) => {
        qrCodeUrl = url
      })
      .catch(() => {})
  }

  const onSubmit = () => {
    gameAuthStore.set(inputForm)
  }

  const onReset = () => {
    gameAuthStore.set(EMPTY_GAME_AUTH)
  }

  const toggleQrCode = () => {
    generateQrCode()
  }
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
      <button on:click={toggleQrCode} class={'px-2 py-1 shrink-0 rounded aspect-square ' + (showQrCode ? 'bg-white text-zinc-800' : 'bg-zinc-800 text-white')}> <QrCodeIcon /> </button>
      <button on:click={onReset} class="px-2 py-1 shrink-0 bg-zinc-800 text-white rounded"> Disconnect </button>
    </div>
    {#if showQrCode && qrCodeUrl}
      <div class="flex items-center gap-2 text-center mt-2">
        <img src={qrCodeUrl} alt="QRCode" />
        <div class="underline bg-zinc-800 rounded rounded-lg p-2 text-sm"><a href={lastQRData} target="_blank" rel="noreferrer">{lastQRData}</a></div>
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
