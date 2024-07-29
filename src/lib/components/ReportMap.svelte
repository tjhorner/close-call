<script lang="ts">
  import { MapLibre, GeoJSON, CircleLayer, SymbolLayer, Popup } from "svelte-maplibre"
  import type { TransportationMode } from "@prisma/client"
  import type { FeatureCollection } from "geojson"
  import maplibregl from "maplibre-gl"
  import ReportDetailPopup from "./ReportDetailPopup.svelte"

  export let reports: {
    occurredAt: Date
    latitude: number
    longitude: number
    transportationMode: TransportationMode
    incidentFactors: string[]
  }[]

  const features: FeatureCollection = {
    type: "FeatureCollection",
    features: reports.map((report) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [report.longitude, report.latitude]
      },
      properties: {
        occurredAt: report.occurredAt,
        transportationMode: report.transportationMode,
        incidentFactors: report.incidentFactors.join(", ")
      }
    }))
  }

  const bounds = reports.length
    ? reports.reduce((bounds, report) => {
        return bounds.extend([report.longitude, report.latitude])
      }, new maplibregl.LngLatBounds())
    : undefined
</script>

<MapLibre
  {bounds}
  standardControls
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json">

  <GeoJSON
    data={features}
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
    >
      <Popup openOn="click" let:features>
        <ReportDetailPopup {features} />
      </Popup>
    </CircleLayer>
  </GeoJSON>
</MapLibre>