import { DiseasesPlantsInputSchema, UpdateDiseasesPlantsInputSchema } from '../utils/validator'
import { DiseasesPlantsRepository } from '../repository/diseasePlants.repository'
import { BaseService } from './base.service'
import { errorHandle } from '../utils'
export class DiseasesService extends BaseService {
  constructor(private readonly diseasesPlantsRepository = new DiseasesPlantsRepository()) {
    super(diseasesPlantsRepository)
  }

  async createNewDiseasesPlants(data: any) {
    const validateArgs = DiseasesPlantsInputSchema.safeParse(data)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }

    const diseasePlants = await this.diseasesPlantsRepository.findAll({ name: data.name }, {})
    if (diseasePlants.length > 0) {
      return this.failedOrSuccessRequest('failed', 'Penyakit sudah ada')
    }

    const newDiseasePlants = await this.diseasesPlantsRepository.createNewDiseasesPlants(data)
    return this.failedOrSuccessRequest('success', newDiseasePlants)
  }

  async update(id: string, body: any) {
    const validateArgs = UpdateDiseasesPlantsInputSchema.safeParse({ ...body, id })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const diseasePlants = this.findById(id)
    if (!diseasePlants) {
      return this.failedOrSuccessRequest('failed', 'Penyakit tidak ditemukan')
    }
    const updateDiseasePlants = await this.diseasesPlantsRepository.update(id, body)
    return this.failedOrSuccessRequest('success', updateDiseasePlants)
  }
}
