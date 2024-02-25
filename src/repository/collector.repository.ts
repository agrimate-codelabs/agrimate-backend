import { PrismaClient } from '@prisma/client'
import type { CollectorInput, AddCommodityInput } from '../types'
import { RegionRepository } from './region.repository'
const prisma = new PrismaClient()
const regionRepository = new RegionRepository()

export class CollectorRepository {
  private async manipulateData(tempData: any) {
    console.log(tempData)
    return Promise.all(
      tempData.map(async (item: any) => {
        const [province, city, district, village] = await Promise.all([
          regionRepository.getRegionByCode(item.provinceId),
          regionRepository.getRegionByCode(item.cityId),
          regionRepository.getRegionByCode(item.districtId),
          regionRepository.getRegionByCode(item.villageId)
        ])
        return {
          id: item.id,
          name: item.name,
          phone: item.phone,
          province: province?.name,
          city: city?.name,
          district: district?.name,
          village: village?.name,
          address: item.address,
          commodities: item.commodity_collectors.map((commodity: any) => {
            return {
              id: commodity.commodityId,
              name: commodity.commodities.name,
              icon: commodity.commodities.icon
            }
          })
        }
      })
    )
  }

  async create(data: CollectorInput) {
    try {
      return await prisma.collectors.create({
        data: {
          userId: data.userId,
          name: data.name,
          phone: data.phone,
          provinceId: data.provinceId,
          cityId: data.cityId,
          districtId: data.districtId,
          villageId: data.villageId,
          address: data.address
        }
      })
    } catch (error) {
      throw error
    }
  }

  async findCollectorByUserId(userId: string) {
    return await prisma.collectors.findFirst({
      where: {
        userId
      }
    })
  }

  async findAll(query: any) {
    try {
      await prisma.collectors.findMany({
        where: {
          name: {
            contains: query.name
          }
        }
      })
    } catch (error) {
      throw error
    }
  }

  async addCommodity(data: AddCommodityInput, collectorId: string) {
    try {
      return await prisma.commodity_collectors.create({
        data: {
          commodityId: data.commodityId,
          collectorId,
          period: new Date(data.period),
          price: +data.price
        }
      })
    } catch (error) {
      throw error
    }
  }

  async findAndCount(query: any, options: any) {
    try {
      const condition: any = {
        where: {
          name: {
            contains: query.name,
            mode: 'insensitive'
          },
          ...(query.commodity !== undefined && {
            commodity_collectors: {
              some: {
                commodityId: query.commodity
              }
            }
          })
        },
        skip: options.skip,
        take: options.take
      }

      const tempData = await prisma.collectors.findMany({
        ...condition,
        include: {
          commodity_collectors: {
            include: {
              commodities: true
            }
          }
        }
      })
      const data = await this.manipulateData(tempData)
      const total = await prisma.collectors.count(condition)
      return {
        collectors: data,
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

  async getMyCommodityByCommodityName(collectorId: string, commodity: string) {
    return await prisma.commodity_collectors.findMany({
      where: {
        collectorId,
        commodities: {
          name: {
            contains: commodity.toLowerCase()
          }
        }
      },
      include: {
        commodities: true
      }
    })
  }

  async getMyCommodity(collectorId: string, query: any) {
    const tempData = await prisma.commodity_collectors.findMany({
      where: {
        collectorId,
        commodities: {
          name: {
            contains: query.commodity,
            mode: 'insensitive'
          }
        }
      },
      include: {
        commodities: true
      }
    })
    const data = tempData.map((item) => {
      return {
        id: item.id,
        commodityId: item.commodityId,
        commodity: item.commodities.name,
        period: item.period,
        price: item.price
      }
    })
    return data
  }

  async getMyCommodityById(id: string) {
    return await prisma.commodity_collectors.findFirst({
      where: {
        id
      }
    })
  }

  async updateMyCommodity(id: string, data: AddCommodityInput) {
    try {
      return await prisma.commodity_collectors.update({
        where: {
          id
        },
        data: {
          commodityId: data.commodityId,
          period: new Date(`${data.period}`),
          price: +data.price
        }
      })
    } catch (error) {
      return false
    }
  }

  async deleteMyCommodity(id: string) {
    return await prisma.commodity_collectors.delete({
      where: {
        id
      }
    })
  }

  async getMyCommudityByCommodityNamePeriodAndCollectorId(collectorId: string, commodityId: string, period: string) {
    const month = new Date(period).getMonth() + 1
    const yearNow = new Date(period).getFullYear()
    const nextMonth = month === 12 ? 1 : month + 1
    const year = month === 12 ? yearNow + 1 : yearNow
    const updated = await prisma.commodity_collectors.findMany({
      where: {
        collectorId,
        commodityId,
        period: {
          gte: new Date(`${year}-${month}-01`), // Start of the specified month and year
          lte: new Date(`${year}-${nextMonth}-01 `) // Start of the next month
        }
      }
    })
    return updated
  }

  async findById(id: string) {
    try {
      const tempData = await prisma.collectors.findUnique({
        where: {
          id: id
        },
        include: {
          commodity_collectors: {
            include: {
              commodities: true
            }
          }
        }
      })
      const data = await this.manipulateData([tempData])
      return data[0]
    } catch (error) {
      throw error
    }
  }
}
