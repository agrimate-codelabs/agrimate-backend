import type { FarmerInput } from '../types'
import { BaseService } from './base.service'
import { FarmerRepository } from '../repository'
export class FarmerService extends BaseService {
  constructor(private readonly farmerRepository = new FarmerRepository()) {
    super(farmerRepository)
  }

  async create(data: FarmerInput) {
    return await this.farmerRepository.createFarmer(data)
  }

  async findFarmerByUserId(userId: string) {
    return await this.farmerRepository.findFarmerByUserId(userId)
  }
}
