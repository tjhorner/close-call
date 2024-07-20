-- CreateTable
CREATE TABLE "IncidentFactor" (
    "id" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,

    CONSTRAINT "IncidentFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CloseCallReportToIncidentFactor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CloseCallReportToIncidentFactor_AB_unique" ON "_CloseCallReportToIncidentFactor"("A", "B");

-- CreateIndex
CREATE INDEX "_CloseCallReportToIncidentFactor_B_index" ON "_CloseCallReportToIncidentFactor"("B");

-- AddForeignKey
ALTER TABLE "_CloseCallReportToIncidentFactor" ADD CONSTRAINT "_CloseCallReportToIncidentFactor_A_fkey" FOREIGN KEY ("A") REFERENCES "CloseCallReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CloseCallReportToIncidentFactor" ADD CONSTRAINT "_CloseCallReportToIncidentFactor_B_fkey" FOREIGN KEY ("B") REFERENCES "IncidentFactor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
