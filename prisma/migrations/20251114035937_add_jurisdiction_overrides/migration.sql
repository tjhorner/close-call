-- CreateTable
CREATE TABLE "JurisdictionOverride" (
    "id" TEXT NOT NULL,
    "geometry" geometry(MultiLineString, 3857) NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "jurisdictionId" TEXT NOT NULL,

    CONSTRAINT "JurisdictionOverride_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JurisdictionOverride" ADD CONSTRAINT "JurisdictionOverride_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "Jurisdiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
