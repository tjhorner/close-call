<script lang="ts">
  export let color: "red" | "yellow" = "red"
</script>

<style>
  .warning {
    padding: 15px;
    border-radius: 5px;
    margin: 15px 0;
  }

  .warning.red {
    background-color: #f8d7da;
    color: #721c24;
  }

  .warning.yellow {
    background-color: #fff3cd;
    color: #856404;
  }

  @media (prefers-color-scheme: dark) {
    .warning.red {
      background-color: #5f0000;
      color: #ffcccc;
    }

    .warning.yellow {
      background-color: #664d03;
      color: #ffec99;
    }
  }
</style>

<div class="warning {color}">
  <slot />
</div>