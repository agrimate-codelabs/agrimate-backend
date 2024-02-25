import { PrismaClient } from '@prisma/client'
import type { CompanyDocumentInput } from '../types'
const prisma = new PrismaClient()
export class CompanyDocumentRepository {
  async create(data: CompanyDocumentInput) {
    return await prisma.company_documents.create({
      data: {
        companyId: data.companyId,
        name: data.name,
        document: data.document
      }
    })
  }
}
