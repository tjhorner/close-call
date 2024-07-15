<script lang="ts">
  export let value: string = ""
</script>

<style>
  textarea {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    min-height: 100px;
    padding: 10px;
    font-size: 1.2em;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>

<textarea bind:value />