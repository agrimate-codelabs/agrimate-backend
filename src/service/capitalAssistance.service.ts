import { BaseService } from "./base.service";
import { CapitalAssistanceRepository } from "../repository";
import type { CapitalAssistanceInput } from '../types'

export class CapitalAssistanceService extends BaseService {
  constructor(
    private readonly capitalAssistanceRepository = new CapitalAssistanceRepository()
  ) {
    super(capitalAssistanceRepository)
  }

  async create(data: CapitalAssistanceInput) {
    const result = await this.capitalAssistanceRepository.create(data)
    return this.failedOrSuccessRequest('success', result)
  }

}