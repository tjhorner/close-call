<script context="module" lang="ts">
  import type { SurveyQuestion } from "../Survey.svelte"

  interface MapPinAnswer {
    latitude: number
    longitude: number
  }

  export interface MapPinQuestion extends SurveyQuestion<
    "mapPin",
    MapPinAnswer
  > { }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let question: MapPinQuestion

  const dispatch = createEventDispatcher<{
    answer: MapPinAnswer
  }>()
</script>