import { getResponse, getHttpCode } from '../utils'
import { Request, Response } from 'express'
import { LandActivityService } from '../service'
const landActivityService = new LandActivityService()

const create = async (req:Request, res:Response) => {
  try{
    const payload = {
      ...req.body,
      date: new Date(req.body.date),
    }
    const result = await landActivityService.create(payload)
    if(result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Gagal menambahkan data', result.data)

    return getResponse(res, getHttpCode.OK, 'Berhasil menambahkan data', result.data)
  }catch(error){
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Server Error', error)
  }
}

const update = async (req:Request, res:Response) => {
  try{
    const id = req.params.id
    const payload = {
      ...req.body,
      date: new Date(req.body.date),
    }
    const result = await landActivityService.update(id, payload)
    if(result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Gagal mengubah data', result.data)
    return getResponse(res, getHttpCode.OK, 'Berhasil mengubah data', result.data)
  }catch(error){
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Server Error', error)
  }
}

const get = async (req:Request, res:Response) => {
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
    const result = await landActivityService.getLandActivityByPlantingId(plantingId, query, options)
    if(result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Gagal mendapatkan data', result.data)
    return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data', result.data)
  }catch(error){
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Server Error', error)
  }
}

const getById = async (req:Request, res:Response) => {
  try{
    const id = req.params.id
    const result = await landActivityService.findById(id)
    if(result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Gagal mendapatkan data', result.data)
    return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data', result.data)
  }catch(error){
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Server Error', error)
  }
}

const upload = async (req:Request, res:Response) => {
  try{
    const file = req.file
    if(!file) return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Gagal upload file', null)
    const result = await landActivityService.upload(file, 'land-activity')
    if (result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Gagal upload file', result.data)
    return getResponse(res, getHttpCode.OK, 'Berhasil upload file', result.data)
  }catch(error){
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Server Error', error)
  }
}

const getFile = async (req:Request, res:Response) => {
  try{
    const key = req.params.key
    const result = await landActivityService.getFile(key, 'land-activity')
    if (result.status === 'failed') {
      res.setHeader('Content-Type', 'image/png')
      return res.send('')
    }
    result.data.Body.pipe(res)
  }catch(error){
    return getResponse(res, getHttpCode.BAD_REQUEST, 'Server Error', error)
  }
}

const deleteImage = async (req: Request, res: Response) => {
  try {
    const key = req.params.key
    const result = await landActivityService.deleteFile(key, 'commodities-icon')
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil menghapus icon', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal menghapus icon', error)
  }
}

export {
  get,
  getById,
  update,
  create,
  upload,
  getFile,
  deleteImage
}