import { getResponse, getHttpCode } from '../utils'
import { CapitalAssistanceService } from '../service'
import { Request, Response } from 'express'

const capitalAssistanceService = new CapitalAssistanceService()

const create = async (req: Request, res: Response) => {
  try {
    const user = req.user
    if(!user) return getResponse(res, getHttpCode.UNAUTHORIZED, 'Unauthorized', null)
    const payload = {
      submission_title: req.body.submission_title,
      farmerId: user.userDetail.farmerId,
      offtakerId: req.body.offtakerId,
      total_land_area: parseFloat(req.body.total_land_area),
      phone: req.body.phone,
      amount : parseFloat(req.body.amount),
      bank_name : req.body.bank_name,
      account_number : req.body.account_number,
      account_name : req.body.account_name,
      farmer_photo : req.body.farmer_photo,
      ktp_photo : req.body.ktp_photo,
      status : 'Dalam Review'
    } 

    const result = await capitalAssistanceService.create(payload)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil Meminta Bantuan Modal', result.data)
  
  } catch (error) {
    console.log(error)
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal Meminta Bantuan Modal', error)
  }
}

const upload = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] }
  if (!files) {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Gagal upload file', null)
  }
  const result = await capitalAssistanceService.uploadMultiple([
    files['ktp_photo'][0],
    files['farmer_photo'][0]
  ], 'capital-assistance')
  if (result.status === 'failed') return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Gagal upload file', result.data)
  return getResponse(res, getHttpCode.OK, 'Berhasil upload file', result.data)
}

export {
  create,
  upload
}