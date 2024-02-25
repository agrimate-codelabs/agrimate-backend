import { getResponse, getHttpCode } from '../utils'
import { Request, Response } from 'express'
import { CheckPlantService } from '../service'
const checkPlantService = new CheckPlantService()

const check = async (req:Request, res:Response) => {
  try{
    if (!req.file) return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Image is required', null)
    const binary = req.file.buffer
    const result = await checkPlantService.check(binary)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil Cek Kesehatan Tanaman', result.data)
  }catch(error){
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal upload foto', error)
  }
}
export {
  check
}