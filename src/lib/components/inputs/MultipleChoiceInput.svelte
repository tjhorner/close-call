<script context="module" lang="ts">
  import type { SurveyQuestion } from "../Survey.svelte"

  export interface MultipleChoiceQuestion extends SurveyQuestion<"multipleChoice", string> {
    options: {
      value: string
      label: string
    }[]
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let question: MultipleChoiceQuestion

  const dispatch = createEventDispatcher<{
    answer: string
  }>()
</script>

<style>
  .answer-button {
    display: block;
    font-size: 1.5em;
    width: 100%;
    background: #48a8ff;
    color: white;
    margin-bottom: 1em;
    border: none;
    padding: 0.25em;
    font-weight: medium;
  }
</style>

{#each question.options as { value, label } (value)}
  <button class="answer-button" on:click={() => dispatch("answer", value)}>{label}</button>
{/each}