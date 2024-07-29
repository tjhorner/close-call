<script lang="ts">
  import type { ActionData, PageData } from "./$types"
  import { enhance } from "$app/forms"
  import Warning from "$lib/components/Warning.svelte"
  import HiddenTurnstile from "$lib/components/HiddenTurnstile.svelte"
  import LocationSection from "./LocationSection.svelte"
  import TimeSection from "./TimeSection.svelte"
  import DescriptionSection from "./DescriptionSection.svelte"
  import TransportationModeSection from "./TransportationModeSection.svelte"
  import ContactSection from "./ContactSection.svelte"

  export let data: PageData
  export let form: ActionData

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
    return async ({ update }) => {
      submitting = false
      update({ reset: false })
    }
  }}>
    <LocationSection />

    <TimeSection />

    <TransportationModeSection />

    <DescriptionSection incidentFactors={data.incidentFactors} />

    <ContactSection />

    <section class="submit">
      {#if form?.errorSummary}
        <Warning color="yellow">
          <strong>Your submission had errors:</strong>
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