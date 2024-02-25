import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class UserRepository {
  async createUser(data: any) {
    const user = await prisma.users.create({
      data: {
        email: data.email,
        password: data.password,
        roles: data.role
      }
    })
    return user
  }

  async delete(id: string) {
    await prisma.users.delete({
      where: {
        id
      }
    })
  }

  async verifyUser(id: string) {
    const user = await prisma.users.update({
      where: {
        id: id
      },
      data: {
        is_verified: true
      }
    })
    return user
  }

  async findUserByEmail(email: string) {
    return await prisma.users.findUnique({
      where: {
        email: email
      }
    })
  }

  async findById(id: string) {
    return await prisma.users.findUnique({
      where: {
        id: id
      }
    })
  }

  async updateUserLogin(id: string, refreshToken: string) {
    return await prisma.users.update({
      where: {
        id: id
      },
      data: {
        refreshToken: refreshToken,
        has_session: true
      }
    })
  }

  async updateUserPassword(id: string, password: string) {
    return await prisma.users.update({
      where: {
        id
      },
      data: {
        password: password
      }
    })
  }
  async userLogout(id: string) {
    return await prisma.users.update({
      where: {
        id: id
      },
      data: {
        refreshToken: null
      }
    })
  }
  async findUserByRefreshToken(refreshToken: string) {
    return await prisma.users.findUnique({
      where: {
        refreshToken: refreshToken
      }
    })
  }
}
