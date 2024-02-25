import { BaseService } from "./base.service";
import type { HarvestingInput } from "../types";
import { harvestingSchema } from "../utils/validator";
import { HarvestingRepository, PlantingRepository } from "../repository";
export class HarvestingService extends BaseService {
  
  constructor(
    private readonly harvestingRepository = new HarvestingRepository(),
    private readonly plantingRepository = new PlantingRepository()
    ) {
    super(harvestingRepository)
  }

  private async checkHarvestingDate(plantingId: string, date: Date) {
    return await this.harvestingRepository.findHarvestingByPlantingIdAndDate(plantingId, date)
  }

  async create(data: HarvestingInput) {
    const validateArgs = harvestingSchema.safeParse(data)
    if(!validateArgs.success) return this.failedOrSuccessRequest('failed', validateArgs.error.message)
    const checkPlanting = await this.plantingRepository.findById(data.plantingId)
    if(!checkPlanting) return this.failedOrSuccessRequest('failed', 'Data Tanaman Tidak Ditemukan')

    const checkHarvestingDate = await this.checkHarvestingDate(data.plantingId, data.date) as any[]
    if(checkHarvestingDate.length > 0) return this.failedOrSuccessRequest('failed', 'Data Panen Pada Bulan Tersebut Sudah Ada')
    
    await this.plantingRepository.updateStatus(data.plantingId, data.status)
    const result = await this.harvestingRepository.create(data)
    return this.failedOrSuccessRequest('success', result)
  }

}