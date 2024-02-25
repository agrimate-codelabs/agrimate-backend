import { getResponse, getHttpCode } from '../utils'
import { Request, Response } from 'express'
import { CommodityService, CollectorService } from '../service'

const commodityService = new CommodityService()

const create = async (req: Request, res: Response) => {
  try {
    const { name, icon , planting_type } = req.body
    const result = await commodityService.create({ name, icon, planting_type })
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil membuat komoditas', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal membuat komoditas', error)
  }
}

const uploadIcon = async (req: Request, res: Response) => {
  try {
    const image = req.file
    if (!image) {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Image is required', null)
    }
    const result = await commodityService.upload(image, 'commodities-icon')
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil upload icon', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal upload icon', error)
  }
}

const getIcon = async (req: Request, res: Response) => {
  try {
    const key = req.params.key
    const result = await commodityService.getFile(key, 'commodities-icon')
    if (result.status === 'failed') {
      res.setHeader('Content-Type', 'image/png')
      return res.send('')
    }
    result.data.Body.pipe(res)
  } catch (error) {
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan icon', error)
  }
}

const deleteIcon = async (req: Request, res: Response) => {
  try {
    const key = req.params.key
    const result = await commodityService.deleteFile(key, 'commodities-icon')
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil menghapus icon', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal menghapus icon', error)
  }
}

const getAll = async (req: Request, res: Response) => {
  try {
    const query = {
      name: req.query.name as string
    }
    const options = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 10
    }
    const result = await commodityService.findAndPaginate(query, options)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data komoditas', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan data komoditas', error)
  }
}

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await commodityService.findById(id)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data komoditas', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan data komoditas', error)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const { name, icon, planting_type } = req.body
    const result = await commodityService.update(id, { name, icon, planting_type })
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil mengubah komoditas', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mengubah komoditas', error)
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await commodityService.delete(id)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil menghapus komoditas', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal menghapus komoditas', error)
  }
}

export { create, uploadIcon, getAll, getById, update, destroy, getIcon, deleteIcon }
