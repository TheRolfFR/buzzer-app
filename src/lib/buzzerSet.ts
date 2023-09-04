import defaultIcon from 'svelte-material-icons/VolumeHigh.svelte'
import boing from 'svelte-material-icons/Kangaroo.svelte'
import buzz from 'svelte-material-icons/BullhornVariant.svelte'
import cow from 'svelte-material-icons/Cow.svelte'
import duck from 'svelte-material-icons/Duck.svelte'
import horn from 'svelte-material-icons/Bugle.svelte'
import siren from 'svelte-material-icons/AlarmLight.svelte'

const soundRecords = import.meta.glob('$static/sounds/*')
const soundPaths = Object.keys(soundRecords)
const publicPaths = soundPaths.map(p => p.replace('/static', ''))

interface BuzzerProperties {
  label: string
  class: string
}
interface AudioSource {
  path: string
  displayName: string
}


interface BuzzerDescription {
  style: BuzzerProperties
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

export default buzzerDescRecords;