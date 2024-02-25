import { Request, Response } from 'express'
import { DiseasesService } from '../service/diseases.service'
import { getHttpCode, getResponse } from '../utils'

const diseasesService = new DiseasesService()
const BUCKET_NAME = 'diseases_plants'

const createDiseases = async (req: Request, res: Response) => {
  const result = await diseasesService.createNewDiseasesPlants({ ...req.body })
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, 200, 'Berhasil Membuat Penyakit baru!', result.data)
}
const uploadImage = async (req: Request, res: Response) => {
  const image = req.file
  if (!image) {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Image is required', null)
  }
  const result = await diseasesService.upload(image, BUCKET_NAME)
  console.log(result)
  return getResponse(res, getHttpCode.OK, 'Berhasil Upload Gambar Penyakit', result)
}

const getImage = async (req: Request, res: Response) => {
  try {
    const key = req.params.key
    const result = await diseasesService.getFile(key, BUCKET_NAME)
    if (result.status === 'failed') {
      res.setHeader('Content-Type', 'image/png')
      return res.send('')
    }
    result.data.Body.pipe(res)
  } catch (error) {
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan gambar', error)
  }
}

const deleteImage = async (req: Request, res: Response) => {
  try {
    const key = req.params.key
    const result = await diseasesService.deleteFile(key, BUCKET_NAME)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil menghapus Image', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal menghapus Immage', error)
  }
}

const getAllDiseases = async (req: Request, res: Response) => {
  const result = await diseasesService.find(req.query, {})
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }

  return getResponse(res, getHttpCode.OK, 'Berhasil Mendapatkan data Penyakit!', result.data)
}

const updateDiseases = async (req: Request, res: Response) => {
  const result = await diseasesService.update(req.params.id, req.body)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, 200, 'Berhasil Update Penyakit!', result.data)
}

const deleteDiseases = async (req: Request, res: Response) => {
  const result = await diseasesService.delete(req.params.id)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }

  return getResponse(res, 200, 'Berhasil Menghapus Penyakit baru!', result.data)
}

export { createDiseases, getAllDiseases, updateDiseases, deleteDiseases, uploadImage, getImage, deleteImage }
