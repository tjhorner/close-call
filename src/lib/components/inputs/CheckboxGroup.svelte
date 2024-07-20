<script lang="ts">
  export let options: {
    label: string,
    value: string
  }[] = []

  export let groupName: string
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
  input[type="checkbox"] {
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
    {@const name = `${groupName}.${option.value}`}

    <label
      class="button"
      for={name}
    >
      <input
        type="checkbox"
        id={name}
        {name}
      />

      {option.label}
    </label>
  {/each}
</div>
