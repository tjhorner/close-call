<script>
  import DateTimeInput from "$lib/components/inputs/DateTimeInput.svelte"
</script>

<section class="time">
  <h2>⏰ When did it happen?</h2>

  <p>
    Please provide the approximate date and time of the incident.
    It doesn't need to be exact.
  </p>

  <DateTimeInput
    name="time"
    aria-label="Time of incident" />
</section>