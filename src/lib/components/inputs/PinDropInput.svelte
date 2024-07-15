<script lang="ts">
  import { onMount } from "svelte"
  import { AttributionControl, DefaultMarker, MapLibre, type LngLatLike } from "svelte-maplibre"
  import Warning from "../Warning.svelte"

  export let name: string
  export let value: { lat: number, lng: number } = { lat: 0, lng: 0 }

  const geolocationAvailable = "geolocation" in navigator

  let basemap = "positron"

  let map: maplibregl.Map
  let gettingLocation = false
  let locationError = false

  function setToCurrentLocation() {
    gettingLocation = true
    locationError = false

    navigator.geolocation.getCurrentPosition((position) => {
      gettingLocation = false

      value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      
      map.flyTo({
        center: [value.lng, value.lat],
        zoom: 15,
        speed: 2
      })
    }, (error) => {
      gettingLocation = false
      locationError = true
      console.warn(error)
    }, {
      enableHighAccuracy: true,
      timeout: 5000
    })
  }

  function darkModeSwitched(e: { matches: boolean }) {
    if (e.matches) {
      basemap = "dark-matter"
    } else {
      basemap = "positron"
    }
  }

  onMount(() => {
    map.setCenter(value)
    map.setZoom(10)

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    mql.onchange = darkModeSwitched
    darkModeSwitched(mql)
  })
</script>

<style>
  :global(.map) {
    height: 250px;
    margin-top: 10px;
  }

  button {
    width: 100%;
  }
</style>

{#if geolocationAvailable}
  <button on:click|preventDefault={setToCurrentLocation} disabled={gettingLocation}>
    {#if gettingLocation}
      Finding your location...
    {:else}
      📍 Use my current location
    {/if}
  </button>
{/if}

{#if locationError}
  <Warning color="yellow">
    Unable to obtain current location. Please drag the pin manually.
  </Warning>
{/if}

<MapLibre
  bind:map={map}
  standardControls
  attributionControl={false}
  style="https://basemaps.cartocdn.com/gl/{basemap}-gl-style/style.json"
  class="map">

  <AttributionControl
    compact />

  <DefaultMarker
    bind:lngLat={value}
    draggable />
</MapLibre>

<input type="hidden" name="{name}.latitude" bind:value={value.lat} />
<input type="hidden" name="{name}.longitude" bind:value={value.lng} />
