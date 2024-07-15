<script context="module" lang="ts">
  import type { SurveyQuestion } from "../Survey.svelte"
  export interface FreeformQuestion extends SurveyQuestion<"freeform", string> { }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let question: FreeformQuestion

  const dispatch = createEventDispatcher<{
    answer: string
  }>()

  dispatch("answer", "hello")
</script>