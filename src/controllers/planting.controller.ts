import { getResponse, getHttpCode } from '../utils'
import { Request, Response } from 'express'
import { PlantingService } from '../service'
const plantingService = new PlantingService()

const create = async (req: Request, res: Response) => {
  try {
    const payload = {
      ...req.body,
      date: new Date(req.body.date)
    }
    const result = await plantingService.create(payload)
    if (result.status === 'failed') return getResponse(res, getHttpCode.BAD_REQUEST, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil membuat data tanam', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal membuat data tanam', error)
  }
}

const update = async (req: Request, res: Response) => {
  try{
    const id = req.params.plantingId
    const payload = {
      ...req.body,
      date: new Date(req.body.date)
    }
    const result = await plantingService.update(id, payload)
    if(result.status === 'failed') return getResponse(res, getHttpCode.BAD_REQUEST, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil mengubah data tanam', result.data)
  }catch(error){

  } 
}

const get = async (req: Request, res: Response) => {
  try {
    const farmLandId = req.params.farmlandId
    const query = {
      startPeriod: req.query.startPeriod as string,
      endPeriod: req.query.endPeriod as string,
      status: req.query.status as string
    }
    const options = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 10
    }
    const result = await plantingService.getPlantingByFarmlandId(farmLandId, query, options)
    if (result.status === 'failed') return getResponse(res, getHttpCode.BAD_REQUEST, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil Mengambil data tanam', result.data)
  } catch (error) {
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mengambil data tanam', error)
  }
}

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await plantingService.getPlantingById(id)
    if (result.status === 'failed') return getResponse(res, getHttpCode.BAD_REQUEST, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil mengambil data tanam', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mengambil data tanam', error)
  }
}

export { create, update, get, getById }
