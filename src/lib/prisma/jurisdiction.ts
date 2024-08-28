import { queryOverpass } from "$lib/overpass"
import { Prisma, type Jurisdiction } from "@prisma/client"

function parseIntOrNull(value: string | undefined): number | null {
  if (!value) return null
  const parsed = parseInt(value)
  return isNaN(parsed) ? null : parsed
}

export const jurisdictionExtensions = Prisma.defineExtension({
  name: "jurisdictionExtensions",
  model: {
    jurisdiction: {
      async getOrCreateByCoordinates<T>(this: T, lat: number, lng: number): Promise<Jurisdiction | null> {
        const context = Prisma.getExtensionContext(this)

        const boundaryResults = await queryOverpass(
          `[timeout:10][out:json];
          is_in(${lat},${lng})->.a;
          relation["boundary"="administrative"]["admin_level"~"8|6|4"](pivot.a);
          out tags;`
        )

        const elements = boundaryResults.elements
        if (elements.length === 0) {
          return null
        }

        const city = elements.find((element) => element.tags["admin_level"] === "8")
        const county = elements.find((element) => element.tags["admin_level"] === "6")

        const cityOrCounty = city ?? county
        if (!cityOrCounty) {
          return null
        }

        const state = elements.find((element) => element.tags["admin_level"] === "4")

        const jurisdictionTags = cityOrCounty.tags

        const osmRelationId = cityOrCounty.id
        const gnisId = jurisdictionTags["gnis:feature_id"] ?? null
        const wikidataId = jurisdictionTags["wikidata"] ?? null

        // Match existing jurisdictions by priority of GNIS ID, Wikidata ID, or OSM relation ID
        let filter: any
        if (gnisId) {
          filter = { gnisId }
        } else if (wikidataId) {
          filter = { wikidataId }
        } else {
          filter = { osmRelationId }
        }

        const fields = {
          name: jurisdictionTags["name"] ?? "Unknown",
          stateName: state?.tags["name"] ?? jurisdictionTags["is_in:state"] ?? null,
          adminLevel: parseIntOrNull(jurisdictionTags["admin_level"]),
          osmRelationId,
          wikidataId,
          gnisId
        }

        const jurisdiction = await (context as any).upsert({
          where: filter,
          update: fields,
          create: fields
        })

        return jurisdiction
      }
    }
  }
})
