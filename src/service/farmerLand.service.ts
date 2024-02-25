import { BaseService } from './base.service'
import { FarmerLandRepository } from '../repository'
import { FarmerLandInput } from '../types'
import { errorHandle } from '../utils'
import { createFarmerLandSchema, updateFarmerLandSchema, getByIdSchema } from '../utils/validator'
export class FarmerLandService extends BaseService {
  constructor (private readonly farmerLandRepository = new FarmerLandRepository()) {
    super(farmerLandRepository)
  }

  async create (data: FarmerLandInput) {
    const validateArgs = createFarmerLandSchema.safeParse(data)
    if (!validateArgs.success) { return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error)) }
    // parse string to json polygon
    let name = data.name
    if (data.name === null || data.name === undefined || data.name === '') {
      const lastestName = (await this.farmerLandRepository.findByStartName('Lahan ' + data.village)).sort((acc:any, prev:any) => {
        const numberOfNameAcc = +acc.name.split(' ')[2]
        const numberOfNamePrev = +prev.name.split(' ')[2]
        return numberOfNamePrev - numberOfNameAcc
      })
      const number = lastestName.length > 0 ? +lastestName[0].name.split(' ')[2] + 1 : 1
      name = 'Lahan ' + data.village + ' ' + number
    }

    const result = await this.farmerLandRepository.create({
      farmerId: data.farmerId,
      name,
      province: data.province,
      city: data.city,
      district: data.district,
      village: data.village,
      address: data.address,
      photo: data.photo,
      landArea: data.landArea,
      polygon: JSON.parse(data.polygon),
      status: data.status
    })
    return this.failedOrSuccessRequest('success', result)
  }

  async update (data: FarmerLandInput, id: string) {
    const validateArgs = createFarmerLandSchema.safeParse(data)
    if (!validateArgs.success) { return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error)) }
    const checkData = await this.farmerLandRepository.findById(id)
    if (!checkData) { return this.failedOrSuccessRequest('failed', 'Data Tidak Ditemukan') }
    const result = await this.farmerLandRepository.update({
      ...data,
      polygon: JSON.parse(data.polygon)
    }, id)
    return this.failedOrSuccessRequest('success', result)
  }

  async getByFarmerId (farmerId: string) {
    const data = await this.farmerLandRepository.getByFarmerId(farmerId)
    if (!data) { return this.failedOrSuccessRequest('failed', 'Data Tidak Ditemukan') }
    return this.failedOrSuccessRequest('success', data)
  }

  async getRemainingLandArea (id: string) {
    const validateArgs = getByIdSchema.safeParse(id)
    if (!validateArgs.success) { return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error)) }
    const checkData = await this.farmerLandRepository.findById(id)
    if (!checkData) { return this.failedOrSuccessRequest('failed', 'Data Tidak Ditemukan') }
    const data = await this.farmerLandRepository.remainingLandArea(id)
    return this.failedOrSuccessRequest('success', data)
  }
}
