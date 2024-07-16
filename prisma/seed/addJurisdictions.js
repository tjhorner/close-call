import { PrismaClient, TransportationMode } from '@prisma/client'
import jurisdictions from './jurisdictions.json' assert { type: "json" }

const prisma = new PrismaClient()

async function main() {
  await prisma.jurisdiction.createMany({
    data: jurisdictions
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