<script lang="ts">
  import type { TransportationMode } from "@prisma/client"
  import type { Feature } from "svelte-maplibre"

  // Hacky workaround: https://github.com/dimfeld/svelte-maplibre/issues/183
  export let features: any

  interface FeatureProps {
    occurredAt: string
    transportationMode: TransportationMode
    description: string | null
    incidentFactors: string
  }

  const featureProps = (features as Feature[] | null)?.[0]?.properties as FeatureProps

  function displayOptionalField(field: string | null) {
    return field?.trim() !== "" ? field!.trim() : "N/A"
  }

  const transportationModeDisplay = {
    [TransportationMode.BICYCLE]: "🚲 Bike",
    [TransportationMode.WALKING]: "🚶 Walking",
    [TransportationMode.SCOOTER]: "🛴 Scooter",
    [TransportationMode.WHEELCHAIR]: "🧑‍🦽 Wheelchair",
    [TransportationMode.OTHER]: "❓ Other"
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
    <th>Incident Factors</th>
    <td>{displayOptionalField(featureProps.incidentFactors)}</td>
  </tr>
  <tr>
    <th>Description</th>
    <td>{displayOptionalField(featureProps.description)}</td>
  </tr>
</table>