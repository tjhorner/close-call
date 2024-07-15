<script lang="ts">
  export let options: {
    label: string,
    value: string
  }[] = []

  export let name: string
  export let value: string | undefined = undefined
</script>

<style>
  @media screen and (max-width: 940px) {
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

  .options button {
    flex-grow: 1;
  }
</style>

<div class="options">
  {#each options as option}
    <button
      on:click|preventDefault={() => value = option.value}
      class:selected={option.value === value}
    >
      {option.label}
    </button>
  {/each}
</div>

<input type="hidden" {name} {value} />