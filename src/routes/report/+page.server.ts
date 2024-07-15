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
  latitude: "-90<parse.number<90",
  longitude: "-180<parse.number<180",
  occurredAt: "parse.date",
  transportationMode: "'walking' | 'bicycle' | 'wheelchair' | 'scooter' | 'other'",
  description: "string",
  emailAddress: "email | ''"
})

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData()

    const reportData = reportForm({
      latitude: getStringValue(data, "location.latitude"),
      longitude: getStringValue(data, "location.longitude"),
      occurredAt: getStringValue(data, "time"),
      transportationMode: getStringValue(data, "transportationMode"),
      description: getStringValue(data, "description"),
      emailAddress: getStringValue(data, "email")
    })

    if (reportData instanceof type.errors) {
      return fail(400, {
        errorSummary: reportData.summary
      })
    }
  
    await prisma.closeCallReport.create({
      data: reportData
    })

    throw redirect(303, "/report/success")
  }
}