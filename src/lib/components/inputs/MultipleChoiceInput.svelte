<script lang="ts">
  export let options: {
    label: string,
    value: string
  }[] = []

  export let name: string
  export let value: string | undefined = undefined
  export let required = false
</script>

<style>
  @media screen and (max-width: 700px) {
    .options {
      flex-direction: column;
    }
  }

  .options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }

  .options .button {
    flex-grow: 1;
  }

  label {
    position: relative;
  }

  /* hacky stuff to use browser native form validation */
  input[type="radio"] {
    z-index: -999;
    height: 1px;
    width: 1px;
    opacity: 0;
    appearance: none;
    position: absolute;
    bottom: 0;
    left: 50%;
  }
</style>

<div class="options">
  {#each options as option}
    <label
      class="button"
      class:selected={option.value === value}
    >
      <input
        type="radio"
        {name} {required}
        bind:group={value}
        value={option.value}
      />

      {option.label}
    </label>
  {/each}
</div>

<!-- <input type="hidden" {name} {required} {value} /> -->