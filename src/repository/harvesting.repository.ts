import { PrismaClient } from "@prisma/client";
import type { HarvestingInput } from "../types";
const prisma = new PrismaClient();
export class HarvestingRepository {
  
  async create(data: HarvestingInput) {
    return await prisma.harvesting.create({
      data : {
        plantingId : data.plantingId,
        date : data.date,
        amount : data.amount,
        status: data.status
      }
    });
  }

  async findHarvestingByPlantingIdAndDate(plantingId: string, date: Date) {
    return await prisma.$queryRaw`
      SELECT * FROM "harvesting"
      WHERE "plantingId" = ${plantingId}
      AND EXTRACT(MONTH FROM "date") = ${date.getMonth() + 1}
    `;
  }

}