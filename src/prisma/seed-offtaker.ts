import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import argon2 from 'argon2'

async function main() {
  const hashPassword = await argon2.hash('12345678')

  const payload = {
    email: 'offtaker@dev.com',
    name: 'Offtaker',
    phone: '08123456789',
    hashPassword: hashPassword,
    role: 'offtaker'
  }

  const data = await prisma.users.create({
    data: {
      email: payload.email,
      password: hashPassword,
      is_verified: true,
      roles: payload.role
    }
  })

  const offtaker = await prisma.offtakers.create({
    data: {
      userId: data.id,
      name: payload.name,
      phone: payload.phone
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
