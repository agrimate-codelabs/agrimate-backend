import { errorHandle } from '../utils'
import { createCommoditySchema, updateCommoditySchema } from '../utils/validator'
import type { CommodityInput } from '../types'
import { CommodityRepository } from '../repository'
import { BaseService } from './base.service'
export class CommodityService extends BaseService {
  constructor(private readonly commodityRepository = new CommodityRepository()) {
    super(commodityRepository)
  }

  async create(data: CommodityInput) {
    const validateArgs = createCommoditySchema.safeParse(data)
    if (!validateArgs.success) return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    const commodity = await this.commodityRepository.createCommodity(data)
    return this.failedOrSuccessRequest('success', commodity)
  }

  async update(id: string, data: CommodityInput) {
    const validateArgs = updateCommoditySchema.safeParse({ data, id })
    if (!validateArgs.success) return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    const commodity = await this.commodityRepository.update(id, data)

    return this.failedOrSuccessRequest('success', commodity)
  }
}
