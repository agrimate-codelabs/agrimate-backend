import prisma from '../middleware/prisma'
import type { CommodityInput } from '../types'

interface Options {
  page: number
  limit: number
}

export class CommodityRepository {
  async createCommodity(data: CommodityInput) {
    try {
      return await prisma.commodities.create({
        data: {
          name: data.name,
          planting_type: data.planting_type || [],
          icon: data.icon
        }
      })
    } catch (error) {
      throw error
    }
  }

  async findAll(query: string, options: Options) {
    try {
      return await prisma.commodities.findMany({
        where: {
          name: {
            contains: query
          }
        },
        skip: (options.page - 1) * options.limit,
        take: options.limit
      })
    } catch (error) {
      throw error
    }
  }

  async findById(id: string) {
    return await prisma.commodities.findFirst({
      where: {
        id: id
      }
    })
  }

  async findAndCount(query: any, options: any) {
    try {
      const condition: any = {
        where: {
          name: {
            contains: query.name
          }
        },
        skip: options.skip,
        take: options.take
      }
      const data = await prisma.commodities.findMany(condition)
      const total = await prisma.commodities.count(condition)
      return {
        commodities: data,
        pagination: {
          total,
          page: options.page,
          limit: options.limit
        }
      }
    } catch (error) {
      throw error
    }
  }

  async delete(id: string) {
    return await prisma.commodities.delete({
      where: {
        id
      }
    })
  }

  async update(id: string, data: CommodityInput) {
    return await prisma.commodities.update({
      where: {
        id: id
      },
      data: {
        name: data.name,
        icon: data.icon,
        planting_type: data.planting_type
      }
    })
  }
}
