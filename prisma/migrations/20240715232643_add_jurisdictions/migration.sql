-- AlterTable
ALTER TABLE "CloseCallReport" ADD COLUMN     "jurisdictionId" TEXT;

-- CreateTable
CREATE TABLE "Jurisdiction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gnisId" TEXT NOT NULL,
    "wikidataId" TEXT,
    "serviceRequestUrl" TEXT,

    CONSTRAINT "Jurisdiction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jurisdiction_gnisId_key" ON "Jurisdiction"("gnisId");

-- CreateIndex
CREATE UNIQUE INDEX "Jurisdiction_wikidataId_key" ON "Jurisdiction"("wikidataId");

-- AddForeignKey
ALTER TABLE "CloseCallReport" ADD CONSTRAINT "CloseCallReport_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
