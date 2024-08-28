<script lang="ts">
  import { onMount } from "svelte"
  import { AttributionControl, DefaultMarker, FullscreenControl, MapLibre, NavigationControl, ScaleControl } from "svelte-maplibre"
  import Warning from "../Warning.svelte"
  import GoogleMapsAutocomplete from "../GoogleMapsAutocomplete.svelte"
  import { PUBLIC_GOOGLE_MAPS_API_KEY as googleMapsApiKey } from "$env/static/public"

  export let name: string
  export let value: { lat: number, lng: number } = { lat: 47.62645194114881, lng: -122.206580681546 }

  const initialValue = structuredClone(value)

  let geolocationAvailable = false

  let basemap = "positron"

  let map: maplibregl.Map
  let gettingLocation = false
  let locationError: string | null = null

  function setToCurrentLocation() {
    gettingLocation = true
    locationError = null

    navigator.geolocation.getCurrentPosition((position) => {
      gettingLocation = false

      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      })
    }, (error) => {
      gettingLocation = false
      locationError = `${error.message} (code: ${error.code})`
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

  function setLocation(location: { lat: number, lng: number }) {
    value = location
    
    map.flyTo({
      center: location,
      zoom: 15,
      speed: 2
    })
  }

  onMount(() => {
    geolocationAvailable = "geolocation" in navigator

    map.setCenter(value)

    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    mql.onchange = darkModeSwitched
    darkModeSwitched(mql)
  })

  $: changedFromInitial = value.lat !== initialValue.lat || value.lng !== initialValue.lng
</script>

<style>
  :global(.map) {
    height: 300px;
    margin-top: 10px;
    border-radius: 5px;
  }

  button {
    width: 100%;
  }

  .separator {
    display: flex;
    align-items: center;
    text-align: center;
  }

  .separator::before,
  .separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--muted);
  }

  .separator:not(:empty)::before {
    margin-right: 0.5em;
  }

  .separator:not(:empty)::after {
    margin-left: 0.5em;
  }
</style>

{#if geolocationAvailable}
  {#if locationError !== null}
    <Warning color="yellow">
      <p>
        Unable to obtain current location. Please use the search or drag the pin manually.
      </p>
      
      <p>
        <details>
          <summary>View error details</summary>
          <pre style="margin: 2px 0">{locationError}</pre>
        </details>
      </p>
    </Warning>
  {/if}

  <button on:click|preventDefault={setToCurrentLocation} type="button" disabled={gettingLocation}>
    {#if gettingLocation}
      Finding your location...
    {:else}
      🗺️ Use my current location
    {/if}
  </button>

  <label class="separator" for="locationAutocomplete">
    Or search for a location, like a cross street:
  </label>
{:else}
  <label for="locationAutocomplete">
    Search below for a location, like a cross street.
  </label>
{/if}

<GoogleMapsAutocomplete
  apiKey={googleMapsApiKey}
  id="locationAutocomplete"
  on:placeSelected={({ detail }) => setLocation(detail)} />

<MapLibre
  bind:map={map}
  attributionControl={false}
  style="https://basemaps.cartocdn.com/gl/{basemap}-gl-style/style.json"
  zoom={9}
  on:click={({ detail }) => setLocation(detail.lngLat)}
  class="map">

  <ScaleControl />
  <NavigationControl />
  <FullscreenControl />
  <AttributionControl compact />

  <DefaultMarker
    offset={[0, -15]}
    bind:lngLat={value}
    draggable />
</MapLibre>

<input type="hidden" name="{name}.valid" value={changedFromInitial} />
<input type="hidden" name="{name}.latitude" value={value.lat} />
<input type="hidden" name="{name}.longitude" value={value.lng} />
