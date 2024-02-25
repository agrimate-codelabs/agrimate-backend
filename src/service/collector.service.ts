import type { AddCommodityInput, CollectorInput } from '../types'
import { BaseService } from './base.service'
import { CollectorRepository, CommodityRepository } from '../repository'
import { addCommoditySchema, deleteCommoditySchema } from '../utils/validator'
import { errorHandle } from '../utils'
import moment from 'moment'

export class CollectorService extends BaseService {
  private readonly commodityRepository: CommodityRepository
  constructor(private readonly collectorRepository = new CollectorRepository()) {
    super(collectorRepository)
    this.commodityRepository = new CommodityRepository()
  }

  async create(data: CollectorInput) {
    return await this.collectorRepository.create(data)
  }

  async findCollectorByUserId(userId: string) {
    return await this.collectorRepository.findCollectorByUserId(userId)
  }

  async addCommodity(data: AddCommodityInput, userId: string) {
    const validateArgs = addCommoditySchema.safeParse(data)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const commodity = await this.commodityRepository.findById(data.commodityId)
    if (!commodity) {
      return this.failedOrSuccessRequest('failed', 'Commodity not found')
    }

    const collector = await this.collectorRepository.findCollectorByUserId(userId)
    if (!collector) {
      return this.failedOrSuccessRequest('failed', 'Collector not found')
    }

    const commodityCollector = await this.collectorRepository.getMyCommudityByCommodityNamePeriodAndCollectorId(
      collector.id,
      data.commodityId,
      data.period.toString()
    )
    if (commodityCollector.length > 0) {
      return this.failedOrSuccessRequest('failed', 'Commodity already added for this month')
    }
    const newCommodityCollector = await this.collectorRepository.addCommodity(data, collector.id)
    return this.failedOrSuccessRequest('success', newCommodityCollector)
  }

  async getMyCommodity(collectorId: string, query: any) {
    let commodities = await this.collectorRepository.getMyCommodity(collectorId, query)
    return this.failedOrSuccessRequest('success', commodities)
  }

  async getMyCommodityById(id: string) {
    const commodity = await this.collectorRepository.getMyCommodityById(id)
    if (!commodity) {
      return this.failedOrSuccessRequest('failed', 'Commodity not found')
    }
    return this.failedOrSuccessRequest('success', commodity)
  }

  async updateMyCommodity(id: string, data: AddCommodityInput, collectorId: string) {
    const validateArgs = addCommoditySchema.safeParse(data)
    if (!validateArgs.success) return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))

    const commodity = await this.commodityRepository.findById(data.commodityId)
    if (!commodity) {
      return this.failedOrSuccessRequest('failed', 'Commodity not found')
    }

    const myCommodity = await this.collectorRepository.getMyCommodityById(id)
    if (!myCommodity) {
      return this.failedOrSuccessRequest('failed', 'Data Tidak Ditemukan')
    }

    const commodityCollector = await this.collectorRepository.getMyCommudityByCommodityNamePeriodAndCollectorId(
      collectorId,
      data.commodityId,
      data.period.toString()
    )

    // check period and data period
    const oldPeriod = moment(myCommodity.period).format('YYYY-MM-DD')
    const sameDate = moment(oldPeriod).isSame(data.period)

    if (commodityCollector.filter((item) => item.id !== collectorId).length > 0 && !sameDate) {
      return this.failedOrSuccessRequest('failed', 'Commodity already added for this month')
    }

    const commodityCollectorUpdate = await this.collectorRepository.updateMyCommodity(id, data)
    if (!commodityCollectorUpdate) {
      return this.failedOrSuccessRequest('failed', 'Gagal Merubah Data')
    }
    return this.failedOrSuccessRequest('success', commodityCollectorUpdate)
  }

  async deleteMyCommodity(id: string) {
    const validateArgs = deleteCommoditySchema.safeParse({ id })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const commodity = await this.collectorRepository.getMyCommodityById(id)
    if (!commodity) {
      return this.failedOrSuccessRequest('failed', 'Commodity not found')
    }
    await this.collectorRepository.deleteMyCommodity(id)
    return this.failedOrSuccessRequest('success', commodity)
  }
}
