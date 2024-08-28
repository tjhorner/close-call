import prisma from "$lib/prisma"

async function main() {
  const reports = await prisma.closeCallReport.findMany({
    where: {
      jurisdictionId: null
    }
  })

  for (const report of reports) {
    console.log(`Updating jurisdiction for ${report.id}`)
    const jurisdiction = await prisma.jurisdiction.getOrCreateByCoordinates(report.latitude, report.longitude)
    if (jurisdiction) {
      console.log(`Found jurisdiction ${jurisdiction.name}`)
      await prisma.closeCallReport.update({
        where: { id: report.id },
        data: { jurisdictionId: jurisdiction.id }
      })
    }
  }
}

main()