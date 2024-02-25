import { getResponse, getHttpCode } from '../utils'
import { Request, Response } from 'express'
import { HarvestingService } from '../service'
const harvestingService = new HarvestingService()

const create = async (req: Request, res: Response) => {
  try{
    const payload = {
      plantingId: req.body.plantingId,
      amount: parseInt(req.body.amount),
      date: new Date(req.body.date) as Date,
      status: 'Panen'
    }
    const result = await harvestingService.create(payload)
    if(result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil Melakukan Panen', result.data)
  }catch(error){
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal Melakukan Panen', error)
  }
}

const cropFailure = async (req: Request, res: Response) => {
  try{
    const payload = {
      plantingId: req.body.plantingId,
      amount: 0,
      date: new Date() as Date,
      status: 'Gagal Panen'
    }
    const result = await harvestingService.create(payload)  
    return getResponse(res, getHttpCode.OK, 'Gagal Melakukan Panen', result.data)
  }catch(error){
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal Melakukan Panen', error)
  }
}

export {
  create,
  cropFailure
}