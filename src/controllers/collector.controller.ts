import { getResponse, getHttpCode } from '../utils'
import { Request, Response } from 'express'
import { CollectorService } from '../service'
const collectorService = new CollectorService()

const getAll = async (req: Request, res: Response) => {
  try {
    const query = {
      name: req.query.name as string,
      commodity: req.query.commodity as string
    }
    const options = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 10
    }
    const result = await collectorService.findAndPaginate(query, options)
    return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data pengepul', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan data pengepul', error)
  }
}

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await collectorService.findById(id)
    if (result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data pengepul', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan data pengepul', error)
  }
}

const addToCollector = async (req: Request, res: Response) => {
  const { commodityId, period, price } = req.body
  const { id: userId }: any = req.user
  const result = await collectorService.addCommodity({ commodityId, period, price }, userId)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil menambahkan komoditas ke kolektor', result.data)
}

const getMyCommodity = async (req: Request, res: Response) => {
  const query = {
    period: req.query.period as string,
    commodity: req.query.commodity as string
  }
  const collectorId = req.user?.userDetail.collectorId

  const result = await collectorService.getMyCommodity(collectorId, query)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data komoditas', result.data)
}

const getMyCommodityById = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await collectorService.getMyCommodityById(id)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data komoditas', result.data)
}

const updateMyCommodity = async (req: Request, res: Response) => {
  const { id } = req.params
  const { price, commodityId, period } = req.body
  const collectorId = req.user?.userDetail.collectorId
  const result = await collectorService.updateMyCommodity(id, { price, period, commodityId }, collectorId)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil mengubah komoditas di kolektor', result.data)
}
const deleteMyCommodity = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await collectorService.deleteMyCommodity(id)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil menghapus komoditas di kolektor', result.data)
}

export { getAll, addToCollector, getMyCommodity, getMyCommodityById, updateMyCommodity, deleteMyCommodity, getById }
