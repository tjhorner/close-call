<script lang="ts">
  import { MapLibre, GeoJSON, CircleLayer, SymbolLayer } from "svelte-maplibre"
  import type { PageData } from "./$types"
  import type { FeatureCollection } from "geojson"
  import { onMount } from "svelte"
  import maplibregl from "maplibre-gl"

  export let data: PageData

  const reports: FeatureCollection = {
    type: "FeatureCollection",
    features: data.reports.map((report) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [report.longitude, report.latitude]
      },
      properties: {
        title: report.occurredAt.toLocaleString(),
      }
    }))
  }

  const bounds = data.reports.length
    ? data.reports.reduce((bounds, report) => {
        return bounds.extend([report.longitude, report.latitude])
      }, new maplibregl.LngLatBounds())
    : undefined

  onMount(() => {
    console.log(reports)
  })
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

<MapLibre
  {bounds}
  standardControls
  style="https://styles.trailsta.sh/openmaptiles-osm.json">

  <GeoJSON
    data={reports}
    cluster={{
      radius: 500,
      maxZoom: 14
    }}
  >
    <CircleLayer
      id="cluster_circles"
      applyToClusters
      paint={{
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 10, '#f1f075', 20, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 20, 40],
        'circle-stroke-width': 1,
        'circle-stroke-opacity': 1,
      }}
      manageHoverState
    />

    <SymbolLayer
      id="cluster_labels"
      interactive={false}
      applyToClusters
      layout={{
        'text-field': [
          'format',
          ['get', 'point_count_abbreviated'],
        ],
        'text-size': 12,
        'text-offset': [0, -0.1],
      }}
    />

    <CircleLayer
      id="reports_circle"
      applyToClusters={false}
      hoverCursor="pointer"
      paint={{
        'circle-color': '#11b4da',
        'circle-radius': 6,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      }}
    />
  </GeoJSON>
</MapLibre>