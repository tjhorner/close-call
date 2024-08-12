<script lang="ts">
  import { onMount } from "svelte"

  let shown = false

  function isStandalone() {
    return (window.navigator as any).standalone || window.matchMedia("(display-mode: standalone)").matches
  }

  onMount(() => {
    shown = !isStandalone()
  })
</script>

{#if shown}
  <slot />
{/if}