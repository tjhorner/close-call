import prisma from "$lib/prisma.js"

export interface CloseCallReportInput {
  latitude: number
  longitude: number
  time: Date
  transportationMode: string
  description: string
  email?: string
}

function getStringValue(form: FormData, key: string): string {
  const value = form.get(key)
  if (typeof value !== "string") {
    throw new Error("Expected string")
  }

  return value
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData()
    
    const latitude = parseFloat(getStringValue(data, "location[latitude]"))
    const longitude = parseFloat(getStringValue(data, "location[longitude]"))
    const time = new Date(getStringValue(data, "time"))
    const transportationMode = getStringValue(data, "transportationMode")
    const description = getStringValue(data, "description")
    const email = getStringValue(data, "email")
    
    await prisma.closeCallReport.create({
      data: {
        occurredAt: time,
        latitude: latitude,
        longitude: longitude,
        description: description,
        emailAddress: email,
        transportationMode: transportationMode
      }
    })

    return "OK"
  }
}