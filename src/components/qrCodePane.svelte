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
    QRCode.toDataURL(qrData)
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
</script>

<div transition:slide class="flex items-stretch gap-2 text-center py-2">
  <div style:width="150px" class="aspect-square bg-white rounded rounded-lg text-black">
    <img src={qrCodeUrl} alt="QR Code" />
  </div>
  <div style:height="150px" class="text-sm flex flex-col flex-grow gap-2">
    <a href={qrData} target="_blank" rel="noreferrer" class="bg-zinc-800 rounded rounded-lg p-2 underline flex-grow flex items-center justify-center">
      {qrData.substring(0, qrData.indexOf('?'))}<br />{qrData.substring(qrData.indexOf('?'))}
    </a>
    <button style:display={cantShare ? 'none' : ''} on:click|preventDefault={onShare} class="bg-zinc-800 rounded rounded-lg p-2 flex items-center justify-center gap-2 text-xl">
      <span class="flex items-center gap-1"><ShareIcon /> <span>Share</span></span>
    </button>
  </div>
</div>
