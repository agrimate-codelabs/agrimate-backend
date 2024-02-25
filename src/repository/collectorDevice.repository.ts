import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class CollectorDeviceRepository {
  async createDeviceToken(token: string, collectorId: string) {
    return await prisma.collector_device.create({
      data: {
        deviceToken: token,
        collectorId
      }
    })
  }

  async findDeviceTokenByUserDetailId(collectorId: string) {
    return await prisma.collector_device.findFirst({
      where: {
        collectorId
      }
    })
  }

  async deleteDeviceToken(id: string) {
    return await prisma.collector_device.delete({
      where: {
        id
      }
    })
  }

  async updateDeviceToken(id: string, token: string) {
    return await prisma.collector_device.update({
      where: {
        id: id
      },
      data: {
        deviceToken: token
      }
    })
  }

  async emptyDeviceToken(id: string) {
    return await prisma.collector_device.update({
      where: {
        id
      },
      data: {
        deviceToken: null
      }
    })
  }
}
