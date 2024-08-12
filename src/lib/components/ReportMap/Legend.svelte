<style>
  .legend {
    color: #333;
    padding: 0.4em 0.5em;
  }

  .legend h2 {
    margin: 0;
    font-size: 1.1em;
  }

  .horiz {
    display: flex;
    align-items: center;
  }

  .horiz .gradient {
    background: linear-gradient(to right, rgb(200,0,0), rgb(33,102,172));
    height: 1em;
    width: 7em;
    flex: 1;
    margin: 0 0.5em;
  }
</style>

<div class="legend">
  <h2>Report Age</h2>
  <div class="horiz">
    <span>Today</span>
    <div class="gradient"></div>
    <span>30+ days</span>
  </div>
</div>