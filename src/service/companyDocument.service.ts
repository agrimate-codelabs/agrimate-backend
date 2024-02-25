import type { CompanyDocumentInput } from '../types'
import { BaseService } from './base.service'
import { CompanyDocumentRepository } from '../repository'

export class CompanyDocumentService extends BaseService {
  constructor(private readonly companyDocumentRepository = new CompanyDocumentRepository()) {
    super(companyDocumentRepository)
  }

  async create(data: CompanyDocumentInput) {
    return this.companyDocumentRepository.create(data)
  }
}
