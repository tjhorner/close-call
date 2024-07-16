import { queryOverpass } from "$lib/overpass.js"
import prisma from "$lib/prisma.js"
import { fail, redirect } from "@sveltejs/kit"
import { type } from "arktype"

function getStringValue(form: FormData, key: string): string {
  const value = form.get(key)
  if (typeof value !== "string") {
    throw new Error(`Expected ${key} to be a string, but got ${typeof value}`)
  }

  return value
}

const reportForm = type({
  latitude: "-90<number<90",
  longitude: "-180<number<180",
  occurredAt: "parse.date",
  transportationMode: "'WALKING' | 'BICYCLE' | 'WHEELCHAIR' | 'SCOOTER' | 'OTHER'",
  description: "string>0",
  emailAddress: "email | ''"
})

async function getJurisdictionId(lat: number, lng: number): Promise<string | null> {
  const boundaryResults = await queryOverpass(
    `[timeout:10][out:json];
    is_in(${lat},${lng})->.a;
    relation["boundary"="administrative"]["admin_level"="8"](pivot.a);
    out tags;`
  )

  if (boundaryResults.elements.length === 0) {
    return null
  }

  const jurisdictionTags = boundaryResults.elements[0].tags
  const gnisId = jurisdictionTags["gnis:feature_id"]

  if (!gnisId) {
    return null
  }

  const jurisdiction = await prisma.jurisdiction.upsert({
    where: {
      gnisId
    },
    update: { },
    create: {
      name: jurisdictionTags["name"] ?? "Unknown",
      stateName: jurisdictionTags["is_in:state"] ?? null,
      wikidataId: jurisdictionTags["wikidata"] ?? null,
      gnisId
    }
  })

  return jurisdiction.id
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData()

    const reportData = reportForm({
      latitude: parseFloat(getStringValue(data, "location.latitude")),
      longitude: parseFloat(getStringValue(data, "location.longitude")),
      occurredAt: getStringValue(data, "time"),
      transportationMode: getStringValue(data, "transportationMode").toUpperCase(),
      description: getStringValue(data, "description"),
      emailAddress: getStringValue(data, "email")
    })

    if (reportData instanceof type.errors) {
      return fail(400, {
        errorSummary: reportData.summary
      })
    }

    let jurisdictionId: string | null = null
    try {
      jurisdictionId = await getJurisdictionId(reportData.latitude, reportData.longitude)
    } catch (error) {
      console.error("Failed to get jurisdiction ID", error)
    }
  
    await prisma.closeCallReport.create({
      data: {
        jurisdictionId,
        ...reportData
      }
    })

    let redirectUrl = "/report/thanks"
    if (jurisdictionId) {
      redirectUrl += `?jurisdiction=${jurisdictionId}`
    }

    throw redirect(303, redirectUrl)
  }
}