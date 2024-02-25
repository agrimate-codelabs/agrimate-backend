/*
  Warnings:

  - Added the required column `planting_type` to the `planting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "planting" ADD COLUMN     "planting_type" TEXT NOT NULL;
