import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import argon2 from 'argon2'

async function main() {
  const hashPassword = await argon2.hash('12345678')

  const payload = {
    email: 'farmer@dev.com',
    hashPassword: hashPassword,
    role: 'farmer'
  }

  const data = await prisma.users.create({
    data: {
      email: payload.email,
      password: hashPassword,
      is_verified: true,
      roles: payload.role
    }
  })

  const farmer = await prisma.farmers.create({
    data: {
      userId: data.id,
      name: 'Farmer',
      phone: '08123456789',
      provinceId: '11',
      cityId: '11.01',
      districtId: '11.01.01',
      villageId: '11.01.01.2001',
      address: 'Jl. Raya'
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
