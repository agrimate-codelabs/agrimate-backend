import { BaseService } from "./base.service";
import type { LandActivityInput } from "../types";
import { getByIdSchema } from "../utils/validator";
import { LandReportRepository, PlantingRepository } from "../repository";
import { errorHandle } from "../utils";
export class LandReportService extends BaseService {
  
  constructor(
    private readonly landReportRepository = new LandReportRepository(),
    private readonly plantingRepository = new PlantingRepository()
  ){
    super(landReportRepository)
  }
  
  async getReportLandByPlantingId(plantingId: string, query: any, options: any) {
    const validateArgs = getByIdSchema.safeParse(plantingId)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const checkPlanting = await this.plantingRepository.findById(plantingId)
    if (!checkPlanting) {
      return this.failedOrSuccessRequest('failed', 'Data Penanaman Tidak Ditemukan')
    }
    const result = await this.landReportRepository.findAndCount(plantingId, query, options)
    return this.failedOrSuccessRequest('success', result)
  }

  async create(data:any){

  }

}