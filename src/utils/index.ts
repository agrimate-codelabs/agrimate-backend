import getHttpCode from './getHttpCode'
import getResponse from './getResponse'
import { uploadImage, uploadBinary, uploadXLSX, uploadPDF } from './storage'
import errorHandle from './errorHandle'
import { transporter, sendMail } from './nodeMailer'
import { uploadFile, getUrl, deleteObject, getObject } from './s3'
import { checkPlantHealth } from './azure/cognitive'
export {
  getResponse,
  getHttpCode,
  uploadImage,
  uploadBinary,
  uploadPDF,
  uploadXLSX,
  errorHandle,
  transporter,
  sendMail,
  uploadFile,
  getUrl,
  deleteObject,
  getObject,
  checkPlantHealth,
}
