import prisma from "$lib/prisma"
import type { PageServerLoad } from "./$types"

export const load = (async () => {
  const reports = prisma.closeCallReport.findMany({
    select: {
      id: true,
      occurredAt: true,
      latitude: true,
      longitude: true,
      transportationMode: true,
      incidentFactors: {
        select: {
          shortDescription: true
        }
      }
    }
  }).then(reports => (
    reports.map(report => ({
      ...report,
      incidentFactors: report.incidentFactors.map(incidentFactor => incidentFactor.shortDescription)
    }))
  ))

  return { reports }
}) satisfies PageServerLoad