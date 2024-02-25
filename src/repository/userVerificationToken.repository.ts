import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class UserVerificationTokenRepository {
  async createUserVerificationToken(data: any) {
    return await prisma.user_verification_tokens.create({
      data: {
        userId: data.userId,
        expires: data.expires,
        token: data.token
      }
    })
  }

  async deleteUserVerificationToken(id: string) {
    return await prisma.user_verification_tokens.delete({
      where: {
        id: id
      }
    })
  }

  async findUserVerificationTokenByToken(token: string) {
    const data = await prisma.user_verification_tokens.findFirst({
      where: {
        token: token
      }
    })
    console.log('data', data)
    return data
  }
}
