/*
  Warnings:

  - Added the required column `farmer_photo` to the `capital_assistance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ktp_photo` to the `capital_assistance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "capital_assistance" ADD COLUMN     "farmer_photo" TEXT NOT NULL,
ADD COLUMN     "ktp_photo" TEXT NOT NULL;
