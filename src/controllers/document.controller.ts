import { getResponse, getHttpCode } from '../utils'
import { Request, Response } from 'express'
import { CompanyDocumentService } from '../service'

const companyDocumentService = new CompanyDocumentService()

const uploadDocument = async (req: Request, res: Response) => {
  try {
    const document = req.file
    if (!document) {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, 'Document is required', null)
    }
    const result = await companyDocumentService.upload(document, 'company-document')
    return getResponse(res, getHttpCode.OK, 'Berhasil upload dokumen', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal upload dokumen', error)
  }
}

const getDocument = async (req: Request, res: Response) => {
  try {
    const key = req.params.key
    const result = await companyDocumentService.getFile(key, 'company-document')
    if (result.status === 'failed') {
      res.setHeader('Content-Type', 'application/pdf')
      return res.send('')
    }
    res.setHeader('Content-Type', 'application/pdf')
    return res.send(result.data.Body)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal mendapatkan dokumen', error)
  }
}

const deleteDocument = async (req: Request, res: Response) => {
  try {
    const key = req.params.key
    const result = await companyDocumentService.deleteFile(key, 'company-document')
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil menghapus dokumen', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal menghapus dokumen', error)
  }
}

export { uploadDocument, getDocument, deleteDocument }
