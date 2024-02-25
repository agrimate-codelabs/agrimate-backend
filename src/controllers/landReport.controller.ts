import { LandReportService } from '../service'
import { getResponse, getHttpCode } from '../utils'
import { Request, Response } from 'express'

const landReportService = new LandReportService()

const get = async (req: Request, res: Response) => {
  try{
    const plantingId = req.params.plantingId
    const query = {
      type: req.query.type as string || '',
    }
    const options = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 10,
      sort: req.query.sort as string || 'createdAt',
      order: req.query.order as string || 'desc',
    }
    const result = await landReportService.getReportLandByPlantingId(plantingId, query, options)
    if(result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Gagal mendapatkan data', result.data)
    return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data', result.data)
  }catch(error){
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan laporan', error)
  }
}

const create = async (req: Request, res: Response) => {
  try{
    const payload = {
      plantingId : req.body.plantingId,
      type : req.body.type,
      problem : req.body.problem,
      image : req.body.image,
    }
    const result = await landReportService.create(payload)
    return getResponse(res, getHttpCode.OK, 'Berhasil membuat laporan', result)
  }catch(error){
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan membuat laporan', error)
  }
}

export {
  get,
  create
}