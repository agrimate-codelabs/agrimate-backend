import { PrismaClient } from '@prisma/client'
import type { CompanyInput } from '../types'
const prisma = new PrismaClient()
export class CompanyRepository {
  async create(data: CompanyInput) {
    return prisma.companies.create({
      data: {
        offtakerId: data.offtakerId,
        nib: data.nib,
        name: data.name,
        provinceId: data.provinceId,
        cityId: data.cityId,
        districtId: data.districtId,
        villageId: data.villageId,
        address: data.address
      }
    })
  }
}
