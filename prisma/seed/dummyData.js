import { PrismaClient, TransportationMode } from '@prisma/client'

const prisma = new PrismaClient()

const locationMin = [
  47.705812896035354, -122.24299301855785
]

const locationMax = [
  47.57801222645059, -122.07746860928717
]

async function main() {
  const data = new Array(1000).fill(null).map(() => {
    return {
      latitude: Math.random() * (locationMax[0] - locationMin[0]) + locationMin[0],
      longitude: Math.random() * (locationMax[1] - locationMin[1]) + locationMin[1],
      occurredAt: new Date(),
      transportationMode: TransportationMode.BICYCLE,
      description: 'A close call',
      emailAddress: 'someone@example.com'
    }
  })

  await prisma.closeCallReport.createMany({
    data
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })