-- CreateTable
CREATE TABLE "CloseCallReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "occurredAt" DATETIME NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "transportationMode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "emailAddress" TEXT
);
