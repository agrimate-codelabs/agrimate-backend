/*
  Warnings:

  - You are about to drop the column `plating_type` on the `commodities` table. All the data in the column will be lost.
  - Added the required column `planting_type` to the `commodities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "commodities" DROP COLUMN "plating_type",
ADD COLUMN     "planting_type" JSONB NOT NULL;
