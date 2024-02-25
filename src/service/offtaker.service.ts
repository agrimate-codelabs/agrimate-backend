import type { OfftakerInput, OfftakerOutput } from '../types'
import { BaseService } from './base.service'
import { OfftakerRepository } from '../repository'
export class OfftakerService extends BaseService {
  constructor(private readonly offtakerRepository = new OfftakerRepository()) {
    super(offtakerRepository)
  }

  async create(data: OfftakerInput) {
    return await this.offtakerRepository.create(data)
  }

  async findOfftakerByUserId(userId: string) {
    return await this.offtakerRepository.findOfftakerByUserId(userId)
  }
}
