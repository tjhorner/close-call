/*
  Warnings:

  - A unique constraint covering the columns `[osmRelationId]` on the table `Jurisdiction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `osmRelationId` to the `Jurisdiction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jurisdiction" ADD COLUMN     "osmRelationId" INTEGER,
ALTER COLUMN "gnisId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Jurisdiction_osmRelationId_key" ON "Jurisdiction"("osmRelationId");
