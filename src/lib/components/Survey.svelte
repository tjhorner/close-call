<script lang="ts" context="module">
  declare const answerType: unique symbol

  type AnySurveyQuestion =
    MultipleChoiceQuestion |
    FreeformQuestion

  type QuestionByType<T extends string> = Extract<AnySurveyQuestion, { type: T }>
  type ExtractQuestionType<T> = T extends SurveyQuestion<infer U, unknown> ? U : never
  type ExtractAnswerType<T> = T extends SurveyQuestion<string, infer U> ? Exclude<U, undefined> : never

  type QuestionInputComponent<T extends SurveyQuestion<any, any>> = ComponentType<SvelteComponent<{
      question: T
    }, {
      answer: CustomEvent<
        Exclude<T[typeof answerType], undefined>
      >
    }>
  >

  type QuestionTypeDefinitions = {
    [K in ExtractQuestionType<AnySurveyQuestion>]: QuestionInputComponent<Extract<AnySurveyQuestion, { type: K }>>
  }

  export interface SurveyQuestion<TType extends string, TAnswer> {
    readonly [answerType]?: TAnswer
    type: TType
    id: string
    prompt: string
  }
</script>

<script lang="ts" generics="T extends AnySurveyQuestion[]">
  import type { DeepReadonly } from "$lib/types/deep-readonly"
  import { createEventDispatcher, type ComponentType, type SvelteComponent } from "svelte"
  import MultipleChoiceInput, { type MultipleChoiceQuestion } from "./inputs/MultipleChoiceInput.svelte"
  import type { FreeformQuestion } from "./inputs/FreeformInput.svelte"
  import FreeformInput from "./inputs/FreeformInput.svelte"

  const questionComponentMap: QuestionTypeDefinitions = {
    multipleChoice: MultipleChoiceInput,
    freeform: FreeformInput
  }

  const dispatch = createEventDispatcher<{
    answer: {
      [K in keyof T]: {
        id: T[K]["id"]
        answer: ExtractAnswerType<
          QuestionByType<T[K]["type"]>
        >
      }
    }[number],
    allAnswers: {
      [K in T[number]["id"]]: ExtractAnswerType<
        QuestionByType<
          PossibleQuestionById<K>["type"]
        >
      >
    }
  }>()

  export let questions: DeepReadonly<T>
  type PossibleQuestionTypes = Extract<AnySurveyQuestion, { type: ExtractQuestionType<T[number]> }>
  type PossibleQuestionById<T extends string> = Extract<PossibleQuestionTypes, { id: T }>

  let currentQuestionIndex = 0

  let answers = { } as any

  $: currentQuestionComponent = questionComponentMap[questions[currentQuestionIndex].type] as QuestionInputComponent<DeepReadonly<AnySurveyQuestion>>
  $: currentQuestion = questions[currentQuestionIndex]
  
  function onAnswer(answer: ExtractAnswerType<AnySurveyQuestion>) {
    dispatch("answer", {
      id: questions[currentQuestionIndex].id,
      answer
    } as any)

    answers[currentQuestion.id] = answer

    if (currentQuestionIndex === questions.length - 1) {
      dispatch("allAnswers", answers)
    } else {
      currentQuestionIndex += 1
    }
  }
</script>

<style>
  .question-prompt {
    font-size: 1.5em;
    margin-bottom: 1em;
  }
</style>

<div class="question-prompt">
  {currentQuestion.prompt}
</div>

<svelte:component
  this={currentQuestionComponent}
  question={questions[currentQuestionIndex]}
  on:answer={(ev) => {
    onAnswer(ev.detail)
  }}
/>