<script lang="ts">
  import PinDropInput from "$lib/components/inputs/PinDropInput.svelte"
</script>

<section class="location">
  <h2>🌎 Where did it happen?</h2>

  <p>
    Drag the pin to the location of the incident.
  </p>

  <PinDropInput name="location" />
</section>