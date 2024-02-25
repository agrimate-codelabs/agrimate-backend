/*
  Warnings:

  - Added the required column `status` to the `harvesting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "harvesting" ADD COLUMN     "status" TEXT NOT NULL;
