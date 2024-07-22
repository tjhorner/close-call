<script lang="ts">
  import { onMount } from "svelte"
  import type { PageData } from "./$types"
  import ShareIcon from "$lib/components/ShareIcon.svelte"

  export let data: PageData
  
  let platform: "ios" | "android" | undefined
  let showHomeScreenInstructions = false

  function isStandalone() {
    return (window.navigator as any).standalone || window.matchMedia("(display-mode: standalone)").matches
  }

  onMount(() => {
    showHomeScreenInstructions = !isStandalone()

    const userAgent = navigator.userAgent || navigator.vendor

    if (/android/i.test(userAgent)) {
      platform = "android"
    }

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      platform = "ios"
    }
  })
</script>

<div class="fixed-width">
  <h1>Thank you for your report!</h1>

  <p>
    Your report has been submitted successfully. Thank you for helping us
    keep roads safe for everyone, no matter how they get around. Your report
    will appear on the map soon.
  </p>

  {#if showHomeScreenInstructions}
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
  {/if}

  {#if data.jurisdiction}
    <h2>Next steps</h2>

    <p>
      You can choose to also report this incident directly with the city of
      <strong>{data.jurisdiction.name}</strong>. Many jurisdictions have a
      self-service portal to submit requests for service, including reporting
      road incidents.
    </p>

    <h3>How to report this incident to {data.jurisdiction.name}</h3>

    <ol>
      {#if data.jurisdiction.serviceRequestUrl}
        <li>
          Visit
          <a
            href={data.jurisdiction.serviceRequestUrl}
            target="_blank"
            rel="noopener noreferer"
          >{data.jurisdiction.name}'s service request portal</a>.
        </li>
      {:else}
        <li>
          Search for
          <a
            href={`https://google.com/search?q=${encodeURIComponent(`${data.jurisdiction.name} ${data.jurisdiction.stateName ?? ""}`.trim())}+service+request`}
            target="_blank"
            rel="noopener noreferer"
          >{data.jurisdiction.name}'s service request portal</a>.
        </li>
      {/if}

      {#if data.jurisdiction.serviceRequestInstructions}
        <li>{data.jurisdiction.serviceRequestInstructions}</li>
      {:else}
        <li>Choose the request category that best matches with the incident.</li>
      {/if}

      <li>Fill out the remaining information.</li>
      <li>Submit your request!</li>
    </ol>
  {/if}

  <a href="/">
    ← Back to map
  </a>
</div>