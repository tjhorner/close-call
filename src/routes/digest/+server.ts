import { getReportClusters } from "$lib/digest/clusters"
import { getNearestIntersection } from "$lib/digest/intersection"
import { summarizeReports } from "$lib/digest/summary"
import type { RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async () => {
  const clusters = await getReportClusters()
  
  for (const cluster of clusters) {
    const nearestIntersection = await getNearestIntersection(
      cluster.centroid.latitude,
      cluster.centroid.longitude,
      80
    )

    console.log(nearestIntersection)

    const summary = await summarizeReports(cluster.reports)
    console.log(summary)

    console.log("----")
  }

  return new Response("OK")
}