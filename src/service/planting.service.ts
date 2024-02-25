import type { PlantingInput } from '../types'
import { BaseService } from './base.service'
import { PlantingRepository, CommodityRepository, FarmerLandRepository } from '../repository'
import { plantingInputSchema, updatePlantingSchema, getByIdSchema } from '../utils/validator'
import { errorHandle } from '../utils'
export class PlantingService extends BaseService {
  constructor(
    private readonly plantingRepository = new PlantingRepository(),
    private readonly farmerLandRepository = new FarmerLandRepository(),
    private readonly commodityRepository = new CommodityRepository()
    ) {
    super(plantingRepository)
  }

  async create(data: PlantingInput) {
    const validateArgs = plantingInputSchema.safeParse(data)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const checkCommodity = await this.commodityRepository.findById(data.commodityId)
    if (!checkCommodity) {
      return this.failedOrSuccessRequest('failed', 'Data Komoditas Tidak Ditemukan')
    }
    const planting = await this.plantingRepository.create(data)
    return this.failedOrSuccessRequest('success', planting)
  }

  async update(id: string, data: PlantingInput) {
    const validateArgs = updatePlantingSchema.safeParse({id,...data})
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const checkCommodity = await this.commodityRepository.findById(data.commodityId)
    if (!checkCommodity) {
      return this.failedOrSuccessRequest('failed', 'Data Komoditas Tidak Ditemukan')
    }
    const planting = await this.plantingRepository.update(id, data)
    return this.failedOrSuccessRequest('success', planting)
  }

  async getPlantingByFarmlandId(farmlandId: string, query: any, options: any) {
    
    const validateArgs = getByIdSchema.safeParse(farmlandId)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    
    const checkFarmland = await this.farmerLandRepository.findById(farmlandId)
    if (!checkFarmland) {
      return this.failedOrSuccessRequest('failed', 'Data Lahan Tidak Ditemukan')
    }

    const tempData = await this.plantingRepository.findAndCount(farmlandId, query, options)
    const data = {
      plantings: tempData.plantings.map((item: any) => {
        let harvestingDate = item.harvesting.length > 0 ? item.harvesting[0].date.toISOString().split('T')[0] : '-'
        return {
          id: item.id,
          plantingDate: item.date.toISOString().split('T')[0],
          harvestingDate,
          plantingSize: item.planting_size,
          plantingQuantity: item.planting_quantity,
          commodity: item.commodities.name,
          lastActivity: item.updatedAt.toISOString().split('T')[0],
          status: item.status
        }
      }),
      pagination: tempData.pagination
    }
    return this.failedOrSuccessRequest('success', data)
  }

  async getPlantingById(id: string) {
    const validateArgs = getByIdSchema.safeParse(id)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const planting = await this.plantingRepository.findById(id)
    if (!planting) {
      return this.failedOrSuccessRequest('failed', 'Data Tanam Tidak Ditemukan')
    }
    return this.failedOrSuccessRequest('success', planting)
  }

}