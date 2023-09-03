<script lang="ts">
  export let label: string
  let className: string = ''

  export let big: boolean = false
  export let nolabel: boolean = false
  $: sizeClasses = big ? 'h-40 text-8xl' : 'h-24 text-6xl'

  export { className as class }
</script>

<div class={'text-white aspect-square shadow-lg rounded-full flex items-center justify-center ' + className + ' ' + sizeClasses}>
  <slot />
</div>
{#if !nolabel}
  <div class="mt-2 font-medium opacity-90 capitalize">
    {label}
  </div>
{/if}
