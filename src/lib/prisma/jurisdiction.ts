import { queryOverpass } from "$lib/overpass"
import { Prisma, type Jurisdiction } from "@prisma/client"

export const jurisdictionExtensions = Prisma.defineExtension({
  name: "jurisdictionExtensions",
  model: {
    jurisdiction: {
      async getOrCreateByCoordinates<T>(this: T, lat: number, lng: number): Promise<Jurisdiction | null> {
        const context = Prisma.getExtensionContext(this)

        const boundaryResults = await queryOverpass(
          `[timeout:10][out:json];
          is_in(${lat},${lng})->.a;
          relation["boundary"="administrative"]["admin_level"~"8|4"](pivot.a);
          out tags;`
        )

        const elements = boundaryResults.elements
        if (elements.length === 0) {
          return null
        }

        const city = elements.find((element) => element.tags["admin_level"] === "8")
        if (!city) {
          return null
        }

        const state = elements.find((element) => element.tags["admin_level"] === "4")

        const jurisdictionTags = city.tags
        const gnisId = jurisdictionTags["gnis:feature_id"]

        if (!gnisId) {
          return null
        }

        const jurisdiction = await (context as any).upsert({
          where: {
            gnisId
          },
          update: {},
          create: {
            name: jurisdictionTags["name"] ?? "Unknown",
            stateName: state?.tags["ref"] ?? jurisdictionTags["is_in:state"] ?? null,
            wikidataId: jurisdictionTags["wikidata"] ?? null,
            gnisId
          }
        })

        return jurisdiction
      }
    }
  }
})
