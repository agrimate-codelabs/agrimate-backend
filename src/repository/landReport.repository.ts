import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class LandReportRepository {

  async findAndCount(plantingId: string, query: any, options: any) {
    const condition: any = {
      where: {
        plantingId: plantingId,
        ...(query.type !== undefined && {
          type: query.type
        })
      },
      orderBy: {
        [options.sort]: options.order
      },
      skip: (options.page - 1) * options.limit,
      take: options.limit
    }
    return await prisma.land_report_problem.findMany({
      ...condition,
      include: {
        planting: true
      }
    })
  }

}
