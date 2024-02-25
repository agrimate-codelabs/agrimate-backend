import { getResponse, getHttpCode } from '../utils'
import { Request, Response } from 'express'
import { FarmerLandService } from '../service'
const farmerLandService = new FarmerLandService()

const uploadThumbnail = async (req: Request, res: Response) => {
  try {
    const image = req.file
    if (!image) {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Image is required', null)
    }
    const result = await farmerLandService.upload(image, 'farmerLand')
    return getResponse(res, getHttpCode.OK, 'Berhasil upload foto', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal upload foto', error)
  }
}

const getThumbnail = async (req: Request, res: Response) => {
  try {
    const key = req.params.key
    const result = await farmerLandService.getFile(key, 'farmerLand')
    if (result.status === 'failed') {
      res.setHeader('Content-Type', 'image/png')
      return res.send('')
    }
    result.data.Body.pipe(res)
  } catch (error) {
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan dokumen', error)
  }
}

const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const key = req.params.key
    const result = await farmerLandService.deleteFile(key, 'commodities-icon')
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil menghapus icon', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal menghapus icon', error)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const farmerId = req.user?.userDetail.farmerId
    const payload = {
      ...req.body,
      landArea: parseFloat(req.body.landArea)
    }
    const result = await farmerLandService.create({
      ...payload,
      farmerId
    })
    if (result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil membuat lahan', result.data)
  } catch (error) {
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal membuat data lahan', error)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const payload = {
      ...req.body,
      landArea: parseInt(req.body.landArea)
    }
    const result = await farmerLandService.update(payload, id)
    if (result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil membuat lahan', result.data)
  } catch (error) {
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal membuat data lahan', error)
  }
}

const getByFarmerId = async (req: Request, res: Response) => {
  try {
    const farmerId = req.user?.userDetail.farmerId
    const result = await farmerLandService.getByFarmerId(farmerId)
    if (result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil menampilkan data lahan', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal menampilkan data lahan', error)
  }
}

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await farmerLandService.findById(id)
    if (result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil menampilkan data lahan', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal menampilkan data lahan', error)
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await farmerLandService.delete(id)
    if (result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil menghapus data lahan', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal menghapus data lahan', error)
  }
}

const getRemainingLandArea = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const result = await farmerLandService.getRemainingLandArea(id)
    if (result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    return getResponse(res, getHttpCode.OK, 'Berhasil mendapatkan data lahan', result.data)
  } catch (error) {
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan data lahan', error)
  }
}

export {
  getByFarmerId,
  create,
  uploadThumbnail,
  getThumbnail,
  getById,
  deleteThumbnail,
  update,
  destroy,
  getRemainingLandArea
}
