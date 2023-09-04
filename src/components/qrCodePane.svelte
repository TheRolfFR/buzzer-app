<script lang="ts">
  import { slide } from 'svelte/transition'
  import ShareIcon from 'svelte-material-icons/Share.svelte'
  import { browser } from '$app/environment'
  import QRCode from 'qrcode'

  export let qrData: string
  $: {
    generateQrCode()
  }

  let qrCodeUrl: string | undefined = undefined
  const generateQrCode = () => {
    qrCodeUrl = undefined
    QRCode.toDataURL(qrData, {
      width: 150
    })
      .then((url: string) => {
        qrCodeUrl = url
      })
      .catch(() => {})
  }

  $: webShareAPISupported = browser && typeof navigator.share !== 'undefined'
  $: onShare = async () => {
    try {
      //! Only works with https
      navigator.share({
        title: 'Buzzer app',
        text: `Buzzer app game`,
        url: qrData
      })
    } catch (error) {
      webShareAPISupported = false
    }
  }
  $: cantShare = !webShareAPISupported

  $: shareString = webShareAPISupported ? 'Share' : 'Share API not supported'
</script>

<div transition:slide id="qrcode-pane">
  <div style:width="150px" id="qrcode-container">
    <img src={qrCodeUrl} style:width="150px" alt={qrData} />
  </div>
  <div style:height="150px" id="share-pane">
    <a href={qrData} target="_blank" rel="noreferrer" class="underline flex-grow">
      {qrData.substring(0, qrData.indexOf('?'))}<br />{qrData.substring(qrData.indexOf('?'))}
    </a>
    <button on:click|preventDefault={onShare} disabled={cantShare} class="text-xl">
      <span class="flex items-center gap-1" title={shareString} class:opacity-70={cantShare}><ShareIcon /> <span>Share</span></span>
    </button>
  </div>
</div>

<style lang="scss">
  #qrcode-pane {
    @apply flex items-stretch gap-2 text-center py-2;
  }

  #qrcode-container, #share-pane > * {
    @apply rounded-lg;
  }

  #qrcode-container {
    @apply aspect-square overflow-hidden bg-white text-black;
  }
  #share-pane {
    @apply text-sm flex flex-col flex-grow gap-2;

    & > * {
      @include bg-darker;
      @include flex-center;
      @apply p-2;
    }
  }
</style>
