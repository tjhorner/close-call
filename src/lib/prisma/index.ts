import { Prisma, PrismaClient } from "@prisma/client"
import { Redis } from "ioredis"
import { createPrismaRedisCache } from "prisma-redis-middleware"
import { jurisdictionExtensions } from "./jurisdiction"

const prisma = new PrismaClient()

if (process.env.REDIS_URL) {
  let redisUrl = process.env.REDIS_URL
  if (process.env.REDIS_FORCE_TLS) {
    redisUrl = redisUrl.replace(/^redis:\/\//, "rediss://")
  }

  const redis = new Redis(redisUrl)

  const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
    models: [
      { model: "Jurisdiction" },
      { model: "CloseCallReport" },
      { model: "IncidentFactor" }
    ],
    storage: {
      type: "redis",
      options: {
        client: redis,
        invalidation: {
          referencesTTL: 3600
        }
      }
    },
    cacheTime: 3600
  })

  prisma.$use(cacheMiddleware)
}

export default prisma.$extends(jurisdictionExtensions)
