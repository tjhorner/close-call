<script lang="ts">
  import BookmarkInstructions from "$lib/components/BookmarkInstructions.svelte"
  import type { PageData } from "./$types"
  export let data: PageData
</script>

<div class="fixed-width">
  <h1>Thank you for your report!</h1>

  <p>
    Your report has been submitted successfully. Thank you for helping us
    keep roads safe for everyone, no matter how they get around. Your report
    will appear on the map soon.
  </p>

  <BookmarkInstructions />

  {#if data.jurisdiction}
    <h2>Next steps</h2>

    <p>
      You can choose to also report this incident directly with
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