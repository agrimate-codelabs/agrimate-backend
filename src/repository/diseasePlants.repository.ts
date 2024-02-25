import { FilterDiseases, DiseasesPlantsInput } from '@/types'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class DiseasesPlantsRepository {
  async findAll(query: FilterDiseases, options: any) {
    return prisma.disease_plants.findMany({ where: { ...query }, ...options })
  }

  async findByName(name: string) {
    return prisma.disease_plants.findFirst({ where: { name } })
  }

  async findById(id: string) {
    return prisma.disease_plants.findUnique({ where: { id } })
  }

  async createNewDiseasesPlants(data: DiseasesPlantsInput) {
    return prisma.disease_plants.create({ data })
  }

  async update(id: string, data: DiseasesPlantsInput) {
    return prisma.disease_plants.update({ where: { id }, data })
  }

  async delete(id: string) {
    return prisma.disease_plants.delete({ where: { id } })
  }
}
