import { PrismaClient } from '@prisma/client'
import type { PlantingInput } from '../types'
const prisma = new PrismaClient()
export class PlantingRepository {

  async create(data: PlantingInput) {
    return await prisma.planting.create({
      data: {
        farmlandId: data.farmlandId,
        commodityId: data.commodityId,
        unit: data.unit,
        planting_size: data.planting_size,
        planting_quantity: data.planting_quantity,
        planting_type: data.planting_type,
        production_cost: data.production_cost,
        longitude: data.longitude,
        latitude: data.latitude,
        date: data.date,
        status: 'Belum Panen'
      }
    })
  }

  async update(id:string, data: PlantingInput){
    return await prisma.planting.update({
      where: {
        id: id
      },
      data: {
        farmlandId: data.farmlandId,
        commodityId: data.commodityId,
        unit: data.unit,
        planting_size: data.planting_size,
        planting_quantity: data.planting_quantity,
        planting_type: data.planting_type,
        production_cost: data.production_cost,
        longitude: data.longitude,
        latitude: data.latitude,
      }
    })
  }

  async findById(id: string) {
    return await prisma.planting.findUnique({
      where: {
        id: id
      },
      include: {
        harvesting: true
      }
    })
  }

  async findAndCount(farmLandId: string | undefined, query: any, options: any) {
    const condition: any = {
      where: {
        ...(farmLandId !== undefined && {
          farmlandId: farmLandId
        }),
        ...(query.startPeriod !== undefined && {
          date: {
            gte: new Date(query.startPeriod)
          }
        }),
        ...(query.endPeriod !== undefined && {
          date: {
            lte: new Date(query.endPeriod)
          }
        }),
        ...(query.status !== undefined && {
          status: {
            in: query.status.map((item: string) => {
              return item
            })
          }
        })
      },
      skip: (options.page - 1) * options.limit,
      take: options.limit
    }
    const data = await prisma.planting.findMany({
      ...condition,
      include: {
        commodities: true,
        harvesting: {
          select: {
            date: true
          }
        }
      }
    })
    const total = await prisma.planting.count(condition)
    return {
      plantings: data,
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        totalPage: Math.ceil(total / options.limit)
      }
    }
  }

  async updateStatus(id: string, status: string) {
    return await prisma.planting.update({
      where: {
        id: id
      },
      data: {
        status: status
      }
    })
  }

}
