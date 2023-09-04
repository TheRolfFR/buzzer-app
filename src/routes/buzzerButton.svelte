<script lang="ts">
  export let label: string
  let className: string = ''

  export let big: boolean = false
  export let nolabel: boolean = false
  $: sizeClasses = big ? 'w-40 text-8xl' : 'w-24 text-6xl'

  export { className as class }
</script>

<div class={'buzzer-button ' + className + ' ' + sizeClasses}>
  <slot />
</div>
{#if !nolabel}
  <div class="mt-2 font-medium opacity-90 capitalize">
    {label}
  </div>
{/if}

<style lang="scss">
  .buzzer-button {
    @apply text-white aspect-square p-1 shadow-lg rounded-full flex items-center justify-center max-w-full;
  }
</style>
