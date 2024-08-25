<script lang="ts">
  import { MapLibre, GeoJSON, CircleLayer, SymbolLayer, Popup, HeatmapLayer, Control, ControlGroup } from "svelte-maplibre"
  import type { TransportationMode } from "@prisma/client"
  import type { FeatureCollection, Feature, Point } from "geojson"
  import maplibregl from "maplibre-gl"
  import ReportDetailPopup from "./ReportDetailPopup.svelte"
  import { onMount } from "svelte"
  import MapControlButton from "./MapControlButton.svelte"
  import Legend from "./Legend.svelte"

  export let initialSelectionId: string | undefined = undefined
  export let reports: {
    id: string
    occurredAt: Date
    latitude: number
    longitude: number
    transportationMode: TransportationMode
    incidentFactors: string[]
  }[]

  let map: maplibregl.Map
  let displayMode: "heatmap" | "cluster" = "cluster"

  let clickedFeature: Feature | undefined = undefined
  $: popupLocation = (clickedFeature?.geometry as Point)?.coordinates as [number, number] | undefined

  const features: FeatureCollection = {
    type: "FeatureCollection",
    features: reports.map((report) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [report.longitude, report.latitude]
      },
      properties: {
        recency: Math.floor((Date.now() - report.occurredAt.getTime()) / 1000 / 60 / 60 / 24),
        occurredAt: report.occurredAt,
        transportationMode: report.transportationMode,
        incidentFactors: report.incidentFactors.join(", ")
      }
    }))
  }

  function toggleDisplayMode() {
    displayMode = displayMode === "heatmap" ? "cluster" : "heatmap"
  }

  $: bounds = reports.length
    ? reports.reduce((bounds, report) => {
        return bounds.extend([report.longitude, report.latitude])
      }, new maplibregl.LngLatBounds())
    : undefined
  
  onMount(() => {
    map.once("load", () => {
      if (bounds) {
        map.fitBounds(bounds, {
          padding: {
            top: 70,
            left: 70,
            right: 70,
            bottom: 150
          },
          duration: 0
        })
      }

      if (initialSelectionId) {
        const initialSelection = reports.find((report) => report.id === initialSelectionId)
        if (initialSelection) {
          // hacks upon hacks. lol
          map.flyTo({
            center: [initialSelection.longitude, initialSelection.latitude],
            zoom: 16,
            duration: 1000
          })

          map.once("idle", () => {
            map.fire("click", {
              latLng: new maplibregl.LngLat(initialSelection.longitude, initialSelection.latitude),
              point: map.project(new maplibregl.LngLat(initialSelection.longitude, initialSelection.latitude)),
              originalEvent: { }
            })
          })
        }
      }
    })
  })
</script>

<MapLibre
  bind:map={map}
  standardControls
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
>
  <Control position="top-right">
    <ControlGroup>
      <Legend />
    </ControlGroup>
  </Control>

  <Control position="top-left">
    <ControlGroup>
      <MapControlButton label="Toggle Heatmap" on:click={toggleDisplayMode}>
        🔥
      </MapControlButton>
    </ControlGroup>
  </Control>

  <slot />

  <GeoJSON
    data={features}
    cluster={displayMode === "cluster" ? {
      radius: 200,
      maxZoom: 14
    } : undefined}
  >
    {#if displayMode === "heatmap"}
      <HeatmapLayer
        maxzoom={16}
        paint={{
          "heatmap-weight": ["interpolate", ["linear"], ["get", "recency"], 0, 3, 30, 1],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 16, 50],
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 14, 1, 16, 0]
        }}
      />
    {/if}

    {#if displayMode === "cluster"}
      <CircleLayer
        id="cluster_circles"
        applyToClusters
        paint={{
          "circle-color": ["step", ["get", "point_count"], "#51bbd6", 10, "#f1f075", 20, "#f28cb1"],
          "circle-radius": ["step", ["get", "point_count"], 20, 10, 30, 20, 40],
          "circle-stroke-width": 1,
          "circle-stroke-opacity": 1
        }}
        manageHoverState
      />

      <SymbolLayer
        id="cluster_labels"
        interactive={false}
        applyToClusters
        layout={{
          "text-field": [
            "format",
            ["get", "point_count_abbreviated"],
          ],
          "text-size": 12,
          "text-offset": [0, -0.1],
        }}
      />
    {/if}

    <CircleLayer
      minzoom={displayMode === "heatmap" ? 14 : undefined}
      id="reports_circle"
      applyToClusters={false}
      hoverCursor="pointer"
      on:click={(e) => (clickedFeature = e.detail.features?.[0])}
      paint={{
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", "recency"],
          0,
          "rgb(220,0,0)",
          30,
          "rgb(33,102,172)",
        ],
        "circle-radius": 8,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      }}
    >
      <Popup openOn="click" lngLat={popupLocation} let:features>
        <ReportDetailPopup {features} />
      </Popup>
    </CircleLayer>
  </GeoJSON>
</MapLibre>