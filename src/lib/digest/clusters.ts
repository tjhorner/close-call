import prisma from "$lib/prisma"
import { getCenter } from "geolib"

export interface ClusteredReport {
  cluster: number | null
  id: string
  latitude: number
  longitude: number
}

export interface Cluster {
  centroid: { latitude: number; longitude: number }
  reports: ClusteredReport[]
}

export interface ClusteredReports {
  clusters: Cluster[]
  remainder: ClusteredReport[]
}

export async function getReportClusters(jurisdictionId: string): Promise<ClusteredReports> {
  const results = await prisma.$queryRaw<ClusteredReport[]>`
    SELECT
      ST_ClusterDBScan("location", eps := 70, minpoints := 2) OVER () AS "cluster",
      "id", "latitude", "longitude"
    FROM
      "CloseCallReport"
    WHERE
      "jurisdictionId" = ${jurisdictionId};
  `

  const clusterMap = new Map<number | null, Cluster>()
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

  const remainder = clusterMap.get(null)?.reports ?? [ ]
  clusterMap.delete(null)

  for (const [ _, cluster ] of clusterMap) {
    const centroid = getCenter(cluster.reports.map(report => ({
      latitude: report.latitude,
      longitude: report.longitude
    })))

    if (centroid === false) { continue }
    cluster.centroid = centroid
  }

  return {
    clusters: Array.from(clusterMap.values()).sort((a, b) => a.reports.length - b.reports.length),
    remainder
  }
}
