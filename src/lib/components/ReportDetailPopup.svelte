<script lang="ts">
  import type { TransportationMode } from "@prisma/client"
  import type { Feature } from "svelte-maplibre"

  // Hacky workaround: https://github.com/dimfeld/svelte-maplibre/issues/183
  export let features: any

  interface FeatureProps {
    occurredAt: string
    transportationMode: TransportationMode
    incidentFactors: string
  }

  $: featureProps = (features as Feature[] | null)?.[0]?.properties as FeatureProps

  function displayOptionalField(field: string | null) {
    return field?.trim() !== "" ? field!.trim() : "N/A"
  }

  const transportationModeDisplay = {
    BICYCLE: "🚲 Bike",
    WALKING: "🚶 Walking",
    SCOOTER: "🛴 Scooter",
    WHEELCHAIR: "🧑‍🦽 Wheelchair",
    OTHER: "❓ Other"
  }
</script>

<style>
  * {
    color: black;
  }

  table {
    max-width: 400px;
  }

  th {
    text-align: right;
    padding-right: 1em;
    white-space: nowrap;
    vertical-align: top;
  }

  td {
    display: block;
    max-height: 150px;
  }

  @media screen and (max-width: 500px) {
    table {
      max-width: 250px;
    }

    td, th {
      float: none;
      display: block;
      text-align: left;
    }
  }
</style>

<table>
  <tr>
    <th>Incident Date</th>
    <td>{new Date(featureProps.occurredAt).toLocaleString()}</td>
  </tr>
  <tr>
    <th>Transportation Mode</th>
    <td>{transportationModeDisplay[featureProps.transportationMode]}</td>
  </tr>
  <tr>
    <th>Incident Summary</th>
    <td>{displayOptionalField(featureProps.incidentFactors)}</td>
  </tr>
</table>