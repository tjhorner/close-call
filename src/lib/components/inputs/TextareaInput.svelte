<script lang="ts">
  export let name: string
  export let value: string = ""
  export let required: boolean = false
</script>

<style>
  textarea {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    min-height: 100px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>

<textarea bind:value {required} {name} />