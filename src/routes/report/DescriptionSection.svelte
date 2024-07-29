<script lang="ts">
  import CheckboxGroup from "$lib/components/inputs/CheckboxGroup.svelte"
  import TextareaInput from "$lib/components/inputs/TextareaInput.svelte"

  export let incidentFactors: { id: string, shortDescription: string }[]
</script>

<section class="description">
  <h2>📝 What happened?</h2>

  <p>
    Select any factors that apply to this incident.
  </p>

  <CheckboxGroup
    groupName="incidentFactors"
    options={incidentFactors.map(({ id, shortDescription }) => ({
      value: id,
      label: shortDescription
    }))} />

  <p>
    You can also optionally describe the incident in more detail below.
  </p>

  <TextareaInput
    aria-label="Additional incident details"
    maxlength={1024}
    placeholder="Example: I was crossing Sesame St at the northwestern corner when a car ran the red light and nearly hit me."
    name="description" />
</section>