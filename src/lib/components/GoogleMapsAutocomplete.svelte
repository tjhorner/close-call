<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"

  export let apiKey: string

  const dispatch = createEventDispatcher<{
    placeSelected: {
      lat: number
      lng: number
    }
  }>()

  let input: HTMLInputElement

  onMount(async () => {
    const { Loader: GoogleMapsLoader } = await import("@googlemaps/js-api-loader")

    const loader = new GoogleMapsLoader({
      apiKey,
      version: "weekly",
      libraries: ["places"]
    })

    const { Autocomplete } = await loader.importLibrary("places")

    const autocomplete = new Autocomplete(
      input,
      { fields: ["geometry"] }
    )

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (!place.geometry || !place.geometry?.location) {
        return
      }

      dispatch("placeSelected", {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      })
    })
  })
</script>

<input
  {...$$restProps}
  bind:this={input}
  type="text"
  placeholder="Example: Sesame St and 1st Ave"
  on:keydown={(e) => e.key === "Enter" && e.preventDefault()} />