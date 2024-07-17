<script lang="ts">
  import { PUBLIC_TURNSTILE_SITE_KEY } from "$env/static/public"
  import { Turnstile } from "svelte-turnstile"

  let show = false
</script>

<style>
  :global(.hidden-turnstile) {
    display: none;
  }
</style>

<Turnstile
  siteKey={PUBLIC_TURNSTILE_SITE_KEY}
  appearance="interaction-only"
  on:before-interactive={() => show = true}
  on:after-interactive={() => show = false}
  class={show ? "" : "hidden-turnstile"} />