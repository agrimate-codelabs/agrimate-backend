import { PrismaClient } from '@prisma/client'
import type { OfftakerInput } from '../types'
const prisma = new PrismaClient()
export class OfftakerRepository {
  async create(data: OfftakerInput) {
    return await prisma.offtakers.create({
      data: {
        userId: data.userId,
        name: data.name,
        phone: data.phone
      }
    })
  }

  async findOfftakerByUserId(userId: string) {
    return await prisma.offtakers.findFirst({
      where: {
        userId: userId
      }
    })
  }
}
