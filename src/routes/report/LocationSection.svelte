<script lang="ts">
  import PinDropInput from "$lib/components/inputs/PinDropInput.svelte"
</script>

<section class="location">
  <h2>🌎 Where did it happen?</h2>

  <p>
    Move the pin to the incident location by tapping on the map.
  </p>

  <PinDropInput name="location" />
</section>