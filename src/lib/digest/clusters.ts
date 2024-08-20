import prisma from "$lib/prisma"
import { getCenter } from "geolib"

export interface ClusteredReport {
  cluster: number
  id: number
  reportedAt: Date
  occurredAt: Date
  latitude: number
  longitude: number
  transportationMode: string
  description: string
}

export interface Cluster {
  centroid: { latitude: number; longitude: number }
  reports: ClusteredReport[]
}

export async function getReportClusters(): Promise<Cluster[]> {
  const results = await prisma.$queryRaw<ClusteredReport[]>`
    WITH clustered_data AS (
      SELECT
        ST_ClusterDBScan("location", eps := 70, minpoints := 2) OVER () AS "cluster",
        "id", "reportedAt", "occurredAt",
        "latitude", "longitude",
        "transportationMode", "description"
      FROM
        "CloseCallReport"
    )
    SELECT * FROM clustered_data WHERE cluster IS NOT NULL;
  `

  const clusterMap = new Map<number, Cluster>()
  for (const report of results) {
    const cluster = clusterMap.get(report.cluster)
    if (cluster) {
      cluster.reports.push(report)
    } else {
      clusterMap.set(report.cluster, {
        centroid: { latitude: 0, longitude: 0 },
        reports: [ report ]
      })
    }
  }

  for (const [ _, cluster ] of clusterMap) {
    const centroid = getCenter(cluster.reports.map(report => ({
      latitude: report.latitude,
      longitude: report.longitude
    })))

    if (centroid === false) { continue }
    cluster.centroid = centroid
  }

  return Array.from(clusterMap.values())
}
