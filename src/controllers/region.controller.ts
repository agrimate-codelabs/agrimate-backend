import { getResponse, getHttpCode } from '../utils'
import { RegionService } from '../service'
import { Request, Response } from 'express'

const regionService = new RegionService()

const getAllRegion = async (req: Request, res: Response) => {
  try {
    const { code, name, type } = req.query
    const result = await regionService.getAll(code as string, name as string, type as string)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data wilayah', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan data wilayah', error)
  }
}

export { getAllRegion }
