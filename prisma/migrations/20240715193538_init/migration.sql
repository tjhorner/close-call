-- CreateEnum
CREATE TYPE "TransportationMode" AS ENUM ('WALKING', 'BICYCLE', 'WHEELCHAIR', 'SCOOTER', 'OTHER');

-- CreateTable
CREATE TABLE "CloseCallReport" (
    "id" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "transportationMode" "TransportationMode" NOT NULL,
    "description" TEXT NOT NULL,
    "emailAddress" TEXT,

    CONSTRAINT "CloseCallReport_pkey" PRIMARY KEY ("id")
);
