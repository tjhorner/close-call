import prisma from "$lib/prisma"
import type { PageServerLoad } from "./$types"

export const load = (async ({ url }) => {
  const jurisdictionId = url.searchParams.get("jurisdiction")
  if (!jurisdictionId) {
    return { jurisdiction: null }
  }

  const jurisdiction = await prisma.jurisdiction.findUnique({
    where: { id: jurisdictionId },
    select: {
      name: true,
      stateName: true,
      serviceRequestUrl: true,
      serviceRequestInstructions: true
    }
  })

  return { jurisdiction }
}) satisfies PageServerLoad