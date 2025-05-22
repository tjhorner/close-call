import type { CloseCallReport, Jurisdiction } from "@prisma/client"
import { getReportClusters } from "./clusters"
import { getNearestIntersection } from "./intersection"
import prisma from "$lib/prisma"
import { summarizeReports } from "./summary"
import type { Feature, FeatureCollection } from "geojson"

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

export async function generateDigestShapefile(jurisdictionId: string): Promise<FeatureCollection> {
  const reports = await prisma.closeCallReport.findMany({
    where: { jurisdictionId },
    include: { incidentFactors: true }
  })

  const features: Feature[] = reports.map((report) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [ report.longitude, report.latitude ]
    },
    properties: {
      id: report.id,
      occurredAt: new Date(report.occurredAt).toISOString(),
      reportedAt: new Date(report.reportedAt).toISOString(),
      description: report.description,
      transportationMode: report.transportationMode,
      incidentFactors: report.incidentFactors.map((factor) => factor.shortDescription)
    }
  }))

  return {
    type: "FeatureCollection",
    features
  }
}
