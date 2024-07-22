<script lang="ts">
  import MultipleChoiceInput from "$lib/components/inputs/MultipleChoiceInput.svelte"
  import Warning from "$lib/components/Warning.svelte"

  let transportationMode: string = ""
</script>

<section class="transportation-mode">
  <h2>🛸 How were you traveling?</h2>
  
  <MultipleChoiceInput
    name="transportationMode"
    required
    bind:value={transportationMode}
    options={[
      {
        label: "🚶 Walking",
        value: "walking"
      },
      {
        label: "🚲 Bike",
        value: "bicycle"
      },
      {
        label: "🧑‍🦽 Wheelchair",
        value: "wheelchair"
      },
      {
        label: "🛴 Scooter",
        value: "scooter"
      },
      {
        label: "❓ Other",
        value: "other"
      }
    ]} />

  {#if transportationMode === "other"}
    <Warning color="yellow">
      Please specify your mode of transportation in the description below.
    </Warning>
  {/if}
</section>