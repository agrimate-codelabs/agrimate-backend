/*
  Warnings:

  - Added the required column `plating_type` to the `commodities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "commodities" ADD COLUMN     "plating_type" JSONB NOT NULL;
