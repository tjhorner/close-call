<script lang="ts">
  import DateTimeInput from "$lib/components/inputs/DateTimeInput.svelte"
  import Warning from "$lib/components/Warning.svelte"

  let date = new Date()

  $: moreThan30DaysAgo = date < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
</script>

<section class="time">
  <h2>⏰ When did it happen?</h2>

  <p>
    Please provide the approximate date and time of the incident.
    It doesn't need to be exact.
  </p>

  <DateTimeInput
    name="time"
    bind:value={date}
    aria-label="Time of incident" />

  {#if moreThan30DaysAgo}
    <Warning color="yellow">
      <strong>Does this look right?</strong>
      The date you entered is more than 30 days ago. You can still
      report this incident, but we wanted to give you a heads up
      in case this was a mistake.
    </Warning>
  {/if}
</section>