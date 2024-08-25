import { queryOverpass } from "$lib/overpass"
import { getDistance } from "geolib"
import { abbreviateStreetAddress } from "./abbreviate"

export async function getNearestIntersection(
  latitude: number,
  longitude: number,
  radius: number
): Promise<string | undefined> {
  const results = await queryOverpass(
    `[out:json][timeout:25];

    way(around:${radius},${latitude},${longitude})["highway"~"^(trunk|primary|secondary|tertiary|unclassified|residential|service)$"]["name"]->.streets;
    
    node(way_link.streets:3-)->.connections;
    
    foreach .connections->.connection(
      way(bn.connection)["highway"]["name"]->.namedRoadways;
      if (namedRoadways.u(t["name"]) == "< multiple values found >") {
        .connection;
        convert node
          ::id=id(),
          street_names=namedRoadways.set(t["name"]),
          lat=lat(),
          lon=lon();
        out tags;
      }
    );`
  )

  const intersections = results.elements.map((element) => ({
    streetNames: element.tags["street_names"].split(";").map(abbreviateStreetAddress),
    distance: getDistance({
      latitude, longitude
    }, {
      latitude: parseFloat(element.tags["lat"]),
      longitude: parseFloat(element.tags["lon"])
    })
  })).sort((a, b) => a.distance - b.distance)

  return intersections[0]?.streetNames.join(" & ")
}