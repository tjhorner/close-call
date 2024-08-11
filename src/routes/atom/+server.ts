import prisma from "$lib/prisma"
import type { RequestHandler } from "@sveltejs/kit"
import { Feed } from "feed"

export const GET: RequestHandler = async ({ url }) => {
  const latestReports = await prisma.closeCallReport.findMany({
    take: 20,
    orderBy: {
      reportedAt: "desc"
    },
    select: {
      id: true,
      reportedAt: true,
      occurredAt: true,
      latitude: true,
      longitude: true,
      transportationMode: true,
      incidentFactors: true,
    }
  })

  const feed = new Feed({
    id: `${url.origin}/atom`,
    copyright: "Close Call",
    title: "Close Call Reports",
    updated: new Date(latestReports[0].reportedAt),
  })

  for (const report of latestReports) {
    feed.addItem({
      id: `${url.origin}/#${report.id}`,
      title: `Close Call Report #${report.id}`,
      link: `${url.origin}/#${report.id}`,
      date: new Date(report.reportedAt),
      content: `
        <p>Occurred at: ${report.occurredAt}</p>
        <p>Location: ${report.latitude}, ${report.longitude}</p>
        <p>Transportation mode: ${report.transportationMode}</p>
        <p>Incident factors: ${report.incidentFactors.map(f => f.shortDescription).join(", ").trim()}</p>
      `
    })
  }

  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8"
    }
  })
}