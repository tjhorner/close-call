<script lang="ts">
  import { onMount } from "svelte"

  export let name: string
  export let value = new Date()

  let inputElement: HTMLInputElement

  function toLocalISOString(date: any) {
    const localDate = new Date(date - date.getTimezoneOffset() * 60000)

    localDate.setSeconds(null as any)
    localDate.setMilliseconds(null as any)
    return localDate.toISOString().slice(0, -1)
  }

  function updateSelectedDate(newValue: string) {
    value = new Date(newValue)
  }

  onMount(() => {
    const initialValue = toLocalISOString(value)
    inputElement.value = initialValue
    inputElement.max = initialValue
  })
</script>

<style>
  input {
    appearance: none;
    font-size: 1.5em;
    width: 100%;
    padding: 10px;
    text-align: center;
  }
</style>

<input
  bind:this={inputElement}
  type="datetime-local"
  on:change={(e) => updateSelectedDate(e.currentTarget.value)} />

<input type="hidden" {name} value={value.toISOString()} />