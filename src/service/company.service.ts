import type { CompanyInput } from '../types'
import { BaseService } from './base.service'
import { CompanyRepository } from '../repository'
export class CompanyService extends BaseService {
  constructor(private readonly companyRepository = new CompanyRepository()) {
    super(companyRepository)
  }

  async create(data: CompanyInput) {
    return await this.companyRepository.create(data)
  }
}
