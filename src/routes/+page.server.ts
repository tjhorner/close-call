import prisma from "$lib/prisma"
import type { PageServerLoad } from "./$types"

export const load = (async ({ setHeaders }) => {
  setHeaders({
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate"
  })

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
      occurredAt: new Date(report.occurredAt), // work around caching issue
      incidentFactors: report.incidentFactors.map(incidentFactor => incidentFactor.shortDescription)
    }))
  ))

  return { reports }
}) satisfies PageServerLoad