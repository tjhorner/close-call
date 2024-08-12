<script lang="ts">
  import { onMount } from "svelte"
  import ShareIcon from "$lib/components/ShareIcon.svelte"
  import NoStandalone from "./NoStandalone.svelte"

  let platform: "ios" | "android" | undefined

  onMount(() => {
    const userAgent = navigator.userAgent || navigator.vendor

    if (/android/i.test(userAgent)) {
      platform = "android"
    }

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      platform = "ios"
    }
  })
</script>

<NoStandalone>
  <p>
    If you want to report a close call easily in the future, you can add this
    form to your phone's home screen. This will give you immediate access to
    the form without needing to open your browser.
  </p>

  {#if platform === "ios" || platform === undefined}
    <h2>Add to Home Screen on iOS</h2>

    <ol>
      <li>Tap the share button ( <ShareIcon size={18} /> ) at the bottom of the screen (scroll up if you don't see it).</li>
      <li>Tap "Add to Home Screen".</li>
      <li>Tap "Add".</li>
    </ol>
  {/if}

  {#if platform === "android" || platform === undefined}
    <h2>Add to Home Screen on Android</h2>

    <p>
      These instructions may depend on the browser you're using. If these instructions
      don't match, you can search for instructions specific to your browser.
    </p>

    <ol>
      <li>Tap the menu button ( ⋮ ) at the top right of the screen.</li>
      <li>Tap "Add to Home screen".</li>
      <li>Tap "Add".</li>
    </ol>
  {/if}
</NoStandalone>