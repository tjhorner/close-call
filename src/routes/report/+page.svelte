<script lang="ts">
  import DateTimeInput from "$lib/components/inputs/DateTimeInput.svelte"
  import MultipleChoiceInput from "$lib/components/inputs/MultipleChoiceInput.svelte"
  import PinDropInput from "$lib/components/inputs/PinDropInput.svelte"
  import TextareaInput from "$lib/components/inputs/TextareaInput.svelte"
  import Warning from "$lib/components/Warning.svelte"

  interface CloseCallReport {
    location: {
      lat: number
      lng: number
    }
    time: Date
    transportationMode?: string
    description: string
  }

  const report: CloseCallReport = {
    location: {
      lat: 47.64494688830544,
      lng: -122.1608240539793
    },
    time: new Date(),
    transportationMode: undefined,
    description: ""
  }
</script>

<div class="fixed-width">
  <h1>Report Close Call</h1>

  <a href="/">
    ← Back to map
  </a>

  <Warning>
    This form is for close calls only. If anyone was involved in a serious collision,
    please <strong><a href="tel:911">dial 911</a></strong> immediately.
  </Warning>

  <section class="location">
    <h2>🌎 Where did it happen?</h2>

    <p>
      Drag the pin to the location of the incident.
    </p>

    <PinDropInput
      bind:value={report.location} />
  </section>

  <section class="time">
    <h2>⏰ When did it happen?</h2>

    <p>
      Please provide the approximate date and time of the incident.
      It doesn't need to be exact.
    </p>

    <DateTimeInput
      bind:value={report.time} />
  </section>

  <section class="transportation-mode">
    <h2>🛸 How were you traveling?</h2>
    
    <MultipleChoiceInput
      bind:value={report.transportationMode}
      options={[
        {
          label: "🚶 Walking",
          value: "walking"
        },
        {
          label: "🚲 Biking",
          value: "bicycle"
        },
        {
          label: "🧑‍🦽 Rolling",
          value: "wheelchair"
        },
        {
          label: "🛴 Scooting",
          value: "scooter"
        },
        {
          label: "❓ Other",
          value: "other"
        }
      ]} />

    {#if report.transportationMode === "other"}
      <Warning color="yellow">
        Please specify your mode of transportation in the description below.
      </Warning>
    {/if}
  </section>

  <section class="description">
    <h2>📝 What happened?</h2>

    <p>
      Please provide a brief description of the incident.
    </p>

    <TextareaInput
      bind:value={report.description} />
  </section>

  <section class="submit">
    <button class="full-width">
      Submit Report
    </button>

    <p>
      By submitting a close call report, you understand that it will be
      displayed anonymously on a public map with other reports in your area.
      The data may also be used by the volunteers at
      <a href="https://eastsideurbanism.org/">Eastside Urbanism</a>
      to help make the roads safer for everyone (for example, by sharing it with local officials).
    </p>
  </section>
</div>