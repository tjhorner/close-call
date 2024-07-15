<script lang="ts">
  import { MapLibre, GeoJSON, CircleLayer, SymbolLayer } from "svelte-maplibre"
  import type { PageData } from "./$types"
  import type { FeatureCollection } from "geojson"
  import { onMount } from "svelte"

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
        title: report.occurredAt.toLocaleString()
      }
    }))
  }

  onMount(() => {
    console.log(reports)
  })
</script>

<MapLibre
  standardControls
  style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json">

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
      hoverCursor="pointer"
      paint={{
        // Use step expressions (https://maplibre.org/maplibre-gl-js-docs/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
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
      id="earthquakes_circle"
      applyToClusters={false}
      hoverCursor="pointer"
      paint={{
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff',
      }}
    />
  </GeoJSON>
</MapLibre>