<script lang="ts">
  import type { ActionData, PageData } from "./$types"
  import { enhance } from "$app/forms"
  import DateTimeInput from "$lib/components/inputs/DateTimeInput.svelte"
  import MultipleChoiceInput from "$lib/components/inputs/MultipleChoiceInput.svelte"
  import PinDropInput from "$lib/components/inputs/PinDropInput.svelte"
  import TextareaInput from "$lib/components/inputs/TextareaInput.svelte"
  import Warning from "$lib/components/Warning.svelte"
  import HiddenTurnstile from "$lib/components/HiddenTurnstile.svelte"
  import CheckboxGroup from "$lib/components/inputs/CheckboxGroup.svelte"

  export let data: PageData
  export let form: ActionData

  let transportationMode = ""
  let submitting = false
</script>

<div class="fixed-width">
  <h1>Report Close Call</h1>

  <a href="/">
    ← Back to map
  </a>

  <Warning>
    This form is for near-misses only. If anyone was involved in a serious collision,
    please <strong><a href="tel:911">dial 911</a></strong> immediately.
  </Warning>

  <form method="post" use:enhance={() => {
    submitting = true
    return async ({ update, result }) => {
      submitting = false
      update({ reset: false })
    }
  }}>
    <section class="location">
      <h2>🌎 Where did it happen?</h2>

      <p>
        Drag the pin to the location of the incident.
      </p>

      <PinDropInput
        name="location"
        value={{
          lat: 47.64494688830544,
          lng: -122.1608240539793
        }} />
    </section>

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

      {#if transportationMode === "other"}
        <Warning color="yellow">
          Please specify your mode of transportation in the description below.
        </Warning>
      {/if}
    </section>

    <section class="description">
      <h2>📝 What happened?</h2>

      <p>
        Select any factors that apply to this incident.
      </p>

      <CheckboxGroup
        groupName="incidentFactors"
        options={data.incidentFactors.map(({ id, shortDescription }) => ({
          value: id,
          label: shortDescription
        }))} />

      <p>
        You can also optionally describe the incident in more detail below.
      </p>

      <TextareaInput
        aria-label="Additional incident details"
        placeholder="Example: I was crossing Sesame St at the northwestern corner when a car ran the red light and nearly hit me."
        name="description" />
    </section>

    <section class="contact">
      <h2>📞 How can we contact you?</h2>

      <p>
        Optionally provide your email address below if you'd like to be contacted
        about your report. It will not be published publicly.
      </p>

      <input
        name="email"
        class="full-width"
        type="email"
        aria-label="Contact email"
        placeholder="you@domain.com" />
    </section>

    <section class="submit">
      {#if form?.errorSummary}
        <Warning color="yellow">
          <strong>Your form submission had errors:</strong>
          {form.errorSummary}
        </Warning>
      {/if}

      <button type="submit" class="full-width" disabled={submitting}>
        {#if submitting}
          Submitting...
        {:else}
          ✅ Submit Report
        {/if}
      </button>

      <HiddenTurnstile />

      <p>
        By submitting a close call report, you understand that it will be
        displayed anonymously on a public map with other reports in your area.
        The data may also be used by the volunteers at
        <a href="https://eastsideurbanism.org/">Eastside Urbanism</a>
        to help make the roads safer for everyone (for example, by sharing it with local officials).
      </p>
    </section>
  </form>
</div>