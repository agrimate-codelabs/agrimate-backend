import { BaseService } from "./base.service";
import type { LandActivityInput } from "../types";
import { createLandActivitySchema, getByIdSchema } from "../utils/validator";
import { LandActivityRepository, PlantingRepository } from "../repository";
import { errorHandle } from "../utils";
export class LandActivityService extends BaseService {
  constructor(
    private readonly landActivityRepository = new LandActivityRepository(),
    private readonly plantingRepository = new PlantingRepository()
    ) {
    super(landActivityRepository)
  }

  async create (payload: LandActivityInput) {
    const validateArgs = createLandActivitySchema.safeParse(payload)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const result = await this.landActivityRepository.create(payload)
    return this.failedOrSuccessRequest('success', result)
  }

  async update (id: string, payload: LandActivityInput) {
    const checkData = await this.landActivityRepository.findById(id)
    if (!checkData) {
      return this.failedOrSuccessRequest('failed', 'Data Tidak Ditemukan')
    }
    const validateArgs = createLandActivitySchema.safeParse(payload)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const result = await this.landActivityRepository.update(id,payload)
    return this.failedOrSuccessRequest('success', result)
  }

  async getLandActivityByPlantingId(plantingId: string, query: any, options: any) {
    const validateArgs = getByIdSchema.safeParse(plantingId)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const checkPlanting = await this.plantingRepository.findById(plantingId)
    if (!checkPlanting) {
      return this.failedOrSuccessRequest('failed', 'Data Penanaman Tidak Ditemukan')
    }
    const tempData = await this.landActivityRepository.findAndCount(plantingId, query, options)
    const data = {
      landActivities: tempData.landActivities.map((item: any) => {
        return {
          id: item.id,
          date: item.date.toISOString().split('T')[0],
          time: item.time,
          type: item.type,
          activity: item.activity,
          image: item.image
        }
      }),
      pagination: tempData.pagination
    }
    return this.failedOrSuccessRequest('success', data)
  }


}