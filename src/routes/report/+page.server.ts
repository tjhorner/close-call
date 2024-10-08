import { TURNSTILE_SECRET_KEY } from "$env/static/private"
import { env as dynamicEnv } from "$env/dynamic/public"
import prisma from "$lib/prisma"
import { fail, redirect } from "@sveltejs/kit"
import { type } from "arktype"
import type { PageServerLoad } from "./$types"
import { validateToken } from "$lib/turnstile"
import { isTextInappropriate } from "$lib/moderation"

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
  description: "string<=1024",
  emailAddress: "email | ''"
})

async function getSelectedIncidentFactors(form: FormData): Promise<string[]> {
  const possibleFactors = await prisma.incidentFactor.findMany({
    select: { id: true }
  })

  const selectedFactors: string[] = []

  for (const factor of possibleFactors) {
    const value = form.get(`incidentFactors.${factor.id}`)
    if (value === "on") {
      selectedFactors.push(factor.id)
    }
  }

  return selectedFactors
}

export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({
    "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate"
  })

  const incidentFactors = prisma.incidentFactor.findMany({
    select: {
      id: true,
      shortDescription: true
    }
  })

  return {
    incidentFactors
  }
}

export const actions = {
  default: async ({ request, getClientAddress }) => {
    const data = await request.formData()

    if (getStringValue(data, "location.valid") === "false") {
      return fail(400, {
        errorSummary: "Please move the pin to the incident location."
      })
    }

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

    reportData.description = reportData.description.trim()
    if (reportData.description.length > 0) {
      const descriptionIsInappropriate = await isTextInappropriate(reportData.description)
      if (descriptionIsInappropriate) {
        return fail(400, {
          errorSummary: "Please remove any inappropriate or offensive language from your description."
        })
      }
    }

    if (!dynamicEnv.PUBLIC_DISABLE_TURNSTILE) {
      const turnstileToken = getStringValue(data, "cf-turnstile-response")
      const { success } = await validateToken(turnstileToken, TURNSTILE_SECRET_KEY)
      if (!success) {
        return fail(403, {
          errorSummary: "Failed to validate CAPTCHA. Please try again."
        })
      }
    }

    let jurisdictionId: string | null = null
    try {
      const foundJurisdiction = await prisma.jurisdiction.getOrCreateByCoordinates(reportData.latitude, reportData.longitude)
      jurisdictionId = foundJurisdiction?.id ?? null
    } catch (error) {
      console.error("Failed to get jurisdiction ID", error)
    }

    const selectedIncidentFactors = await getSelectedIncidentFactors(data)
  
    await prisma.closeCallReport.create({
      data: {
        jurisdictionId,
        submitterIpAddress: getClientAddress(),
        incidentFactors: {
          connect: selectedIncidentFactors.map(id => ({ id }))
        },
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