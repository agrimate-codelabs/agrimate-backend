import prisma from '../middleware/prisma'
import { FarmerLandInput } from '../types'
import { RegionRepository } from './region.repository'
const regionRepository = new RegionRepository()

export class FarmerLandRepository {
  async create(data: FarmerLandInput) {
    try {
      return await prisma.farmlands.create({
        data: {
          farmerId: data.farmerId,
          name: data.name,
          province: data.province,
          city: data.city,
          district: data.district,
          village: data.village,
          address: data.address,
          landArea: data.landArea,
          polygon: data.polygon,
          photo: data.photo
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async getByFarmerId(farmerId: any) {
    try {
      return await prisma.farmlands.findMany({
        where: {
          farmerId: farmerId
        }
      })
    } catch (error) {
      throw error
    }
  }

  async findByName(name: string) {
    try {
      return await prisma.farmlands.findFirst({
        where: {
          name: name
        }
      })
    } catch (error) {
      throw error
    }
  }
  async findByStartName(name: string) {
    return await prisma.farmlands.findMany({
      where: {
        name: {
          startsWith: name
        }
      }
    })
  }

  async findById(id: string) {
    try {
      const tempData = await prisma.farmlands.findUniqueOrThrow({
        where: {
          id: id
        }
      })
      return {
        id: tempData.id,
        name: tempData.name,
        province: tempData.province,
        city: tempData.city,
        district: tempData.district,
        village: tempData.village,
        address: tempData.address,
        landArea: tempData.landArea,
        polygon: tempData.polygon,
        photo: tempData.photo
      }
    } catch (error) {
      throw error
    }
  }

  async update(data: FarmerLandInput, id: string) {
    try {
      return await prisma.farmlands.update({
        where: {
          id: id
        },
        data: {
          name: data.name,
          province: data.province,
          city: data.city,
          district: data.district,
          village: data.village,
          address: data.address,
          landArea: data.landArea,
          polygon: data.polygon,
          photo: data.photo
        }
      })
    } catch (error) {
      throw error
    }
  }

  async delete(id: string) {
    return await prisma.farmlands.delete({
      where: {
        id
      }
    })
  }

  async remainingLandArea(id: string) {
    const condition: any = {
      where: {
        farmlandId: id,
        status: 'Belum Panen'
      }
    }
    const usedArea: any = await prisma.planting.aggregate({
      ...condition,
      _sum: {
        planting_size: true
      }
    })
    const totalArea = await prisma.farmlands.aggregate({
      where: {
        id: id
      },
      _sum: {
        landArea: true
      }
    })

    return {
      usedArea: usedArea._sum.planting_size,
      totalArea: totalArea._sum.landArea
    }
  }
}
