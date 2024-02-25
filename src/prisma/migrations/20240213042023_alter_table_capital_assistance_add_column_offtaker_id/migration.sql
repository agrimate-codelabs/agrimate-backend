/*
  Warnings:

  - Added the required column `offtakerId` to the `capital_assistance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "capital_assistance" ADD COLUMN     "offtakerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "capital_assistance" ADD CONSTRAINT "capital_assistance_offtakerId_fkey" FOREIGN KEY ("offtakerId") REFERENCES "offtakers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
