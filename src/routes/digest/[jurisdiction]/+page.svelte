<script lang="ts">
  import { MapLibre, Marker } from "svelte-maplibre"
  import type { PageData } from "./$types"
  import type { CloseCallReport } from "@prisma/client"

  export let data: PageData

  const transportationModeDisplay: { [key: string]: string } = {
    BICYCLE: "🚲 Bike",
    WALKING: "🚶 Pedestrian",
    SCOOTER: "🛴 Scooter",
    WHEELCHAIR: "🧑‍🦽 Wheelchair",
    OTHER: "❓ Other"
  }

  function getCountByTransportationMode(reports: CloseCallReport[]) {
    const counts = reports.reduce((acc, report) => {
      acc[report.transportationMode] = (acc[report.transportationMode] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b))
  }
</script>

<style>
  :global(body) {
    width: 8.5in;
  }

  .hotspot {
    display: flex;
    margin-bottom: 20px;
    gap: 20px;
  }

  :global(.hotspot-map) {
    min-height: 200px;
    height: 100%;
    width: 300px;
  }

  :global(.report-marker) {
    background: red;
    height: 10px;
    width: 10px;
    border-radius: 100%;
  }

  .cover {
    display: none;
  }

  footer {
    display: none;
  }

  .digest-section h1 {
    margin-bottom: 15px;
  }

  .transportation-modes {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 25px;
  }

  .details h2 {
    margin-bottom: 8px;
  }

  .details p {
    margin: 10px 0;
  }

  @media screen {
    :global(body) {
      margin: 0 auto;
    }
  }

  .report h3 {
    margin-top: 16px;
    margin-bottom: 5px;
  }

  .report p {
    margin-top: 0;
  }

  .report {
    border-top: 1px solid lightgray;
  }

  @media print {
    .cover {
      width: 100vw;
      height: 100vh;
      display: block;
      page-break-after: always;
    }

    .cover .title {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 15px;
    }

    .cover h1, .cover h2, .cover h3 {
      margin: 0;
    }

    .digest-section {
      page-break-before: always;
    }

    footer {
      display: block;
      position: fixed;
      bottom: 0;
      width: 100%;
      opacity: 0.5;
    }

    h1, h2, h3 {
      letter-spacing: -0.05em;
    }
  }
</style>

<div class="cover">
  <div class="title">
    <h1>Close Call Report Digest</h1>
    <h2>{data.jurisdiction.name}, {data.jurisdiction.stateName}</h2>
    <h3>August 2024</h3>
  </div>
</div>

<footer>
  Map data &copy; OpenStreetMap contributors, styles &copy; CARTO
</footer>

<div class="digest-section">
  <h1>Report Hot Spots</h1>

  <p>
    The areas listed below had a high frequency of close call reports and may warrant
    further attention.
  </p>

  {#each data.hotSpots as hotspot}
    <div class="hotspot">
      <div class="map">
        <MapLibre
          class="hotspot-map"
          attributionControl={false}
          style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
          center={[ hotspot.longitude, hotspot.latitude ]}
          zoom={16}
          interactive={false}
        >
          {#each hotspot.reports as report}
            <Marker class="report-marker" lngLat={[ report.longitude, report.latitude ]} />
          {/each}
        </MapLibre>
      </div>
      <div class="details">
        <h2>{hotspot.title}</h2>
        <div class="transportation-modes">
          {#each getCountByTransportationMode(hotspot.reports) as [mode, count]}
            <div class="mode"><strong>{transportationModeDisplay[mode]}</strong>: {count}</div>
          {/each}
        </div>
        <p>
          {hotspot.summary}
        </p>
      </div>
    </div>
  {/each}
</div>

<div class="digest-section">
  <h1>Other Reports</h1>

  <p>
    These reports were not associated with a hot spot but may still be of interest.
    Complete report data is provided in the attached shapefile.
  </p>

  {#each data.otherReports as report}
    <div class="report">
      <h3>{report.occurredAt.toLocaleString()} &bull; {transportationModeDisplay[report.transportationMode]}</h3>
      <p>{report.description}</p>
    </div>
  {/each}
</div>
