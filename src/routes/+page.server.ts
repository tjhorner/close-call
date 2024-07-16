import prisma from "$lib/prisma"
import type { PageServerLoad } from "./$types"

export const load = (async () => {
  const reports = await prisma.closeCallReport.findMany({
    select: {
      id: true,
      occurredAt: true,
      latitude: true,
      longitude: true,
      transportationMode: true
    }
  })

  return { reports }
}) satisfies PageServerLoad