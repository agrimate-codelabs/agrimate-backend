import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class ChangePasswordTokenRepository {
  async createChangePasswordToken(data: any) {
    return await prisma.change_password_tokens.create({
      data: {
        userId: data.userId,
        expires: data.expires,
        token: data.token
      }
    })
  }
  async deleteChangePasswordToken(id: string) {
    return await prisma.change_password_tokens.delete({
      where: {
        id: id
      }
    })
  }
  async findChangePasswordTokenByToken(token: string) {
    return await prisma.change_password_tokens.findUnique({
      where: {
        token: token
      }
    })
  }

  async countChangePasswordTokenPerDayByUserId(userId: string, date: Date) {
    return await prisma.change_password_tokens.count({
      where: {
        userId: userId,
        expires: {
          gte: date
        }
      }
    })
  }
}
