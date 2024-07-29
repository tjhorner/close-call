<script lang="ts">
  import ReportMap from "$lib/components/ReportMap.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<style>
  .overlay-buttons {
    z-index: 999;
    display: flex;
    position: fixed;
    gap: 15px;
    pointer-events: none;
  }

  .overlay-buttons.top-right {
    top: 0;
    right: 0;
    flex-direction: row;
    padding: 20px;
  }

  .overlay-buttons.bottom-center {
    bottom: 0;
    left: 0;
    width: 100%;
    align-items: center;
    flex-direction: column;
    padding-bottom: 3em;
  }

  .round-button {
    width: fit-content;
    pointer-events: auto;
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--blue);
    color: white;
    border-radius: 40px;
    text-decoration: none;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    transition: transform 0.1s ease;
  }

  .round-button:active {
    transform: scale(0.95);
  }

  .round-button.big {
    font-size: 1.5em;
    font-weight: bold;
  }

  .round-button.gray {
    background-color: #797979;
  }
</style>

<div class="overlay-buttons bottom-center">
  <a href="/report" class="round-button big">
    ❕ Report Close Call
  </a>
</div>

<div class="overlay-buttons top-right">
  <a href="/about" class="round-button gray">
    About
  </a>
</div>

{#await data.reports then reports}
  <ReportMap {reports} />
{/await}