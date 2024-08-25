import type { CloseCallReport, Jurisdiction } from "@prisma/client"
import { getReportClusters } from "./clusters"
import { getNearestIntersection } from "./intersection"
import prisma from "$lib/prisma"
import { summarizeReports } from "./summary"

export interface DigestData {
  jurisdiction: Jurisdiction
  hotSpots: {
    latitude: number
    longitude: number
    title: string
    summary: string
    reports: CloseCallReport[]
  }[]
  otherReports: CloseCallReport[]
}

export async function generateDigestData(jurisdictionId: string): Promise<DigestData> {
  const jurisdiction = await prisma.jurisdiction.findUnique({
    where: { id: jurisdictionId }
  })

  if (!jurisdiction) {
    throw new Error("Jurisdiction not found")
  }

  const data: DigestData = {
    jurisdiction,
    hotSpots: [ ],
    otherReports: [ ]
  }

  const clusteredReports = await getReportClusters(jurisdictionId)
  for (const cluster of clusteredReports.clusters) {
    const reports = await prisma.closeCallReport.findMany({
      where: {
        id: { in: cluster.reports.map((report) => report.id) }
      }
    })

    const [ crossStreet, summary ] = await Promise.all([
      getNearestIntersection(cluster.centroid.latitude, cluster.centroid.longitude, 80),
      summarizeReports(reports)
    ])

    data.hotSpots.push({
      latitude: cluster.centroid.latitude,
      longitude: cluster.centroid.longitude,
      title: crossStreet ?? "Unknown intersection",
      summary: summary ?? "No summary available",
      reports
    })
  }

  data.otherReports = await prisma.closeCallReport.findMany({
    where: {
      jurisdictionId,
      id: { in: clusteredReports.remainder.map((report) => report.id) }
    },
    orderBy: { occurredAt: "desc" }
  })

  return data
}
