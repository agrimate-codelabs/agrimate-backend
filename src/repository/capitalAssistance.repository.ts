import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import type { CapitalAssistanceInput } from '../types'
export class CapitalAssistanceRepository {

  async create(data: CapitalAssistanceInput) {
    return await prisma.capital_assistance.create({
      data : {
        farmerId: data.farmerId,
        offtakerId: data.offtakerId,
        submission_title: data.submission_title,
        total_land_area: data.total_land_area,
        phone: data.phone,
        amount: data.amount,
        bank_name: data.bank_name,
        account_number: data.account_number,
        account_name: data.account_name,
        status: data.status,
        farmer_photo: data.farmer_photo,
        ktp_photo: data.ktp_photo
      }
    })
  }

}