import multer from 'multer'
import path from 'path'

const memoryStorage = multer.memoryStorage()
const storage = multer.diskStorage({
  destination: function (req, file, callback: any) {
    callback(null, './public/uploads')
  },
  filename: function (req: any, file: any, callback: any) {
    callback(null, Date.now() + '-' + path.extname(file.originalname))
  }
})

const uploadBinary = multer({
  storage: memoryStorage,
  limits: { fileSize: 1024 * 1024 * 5 }
})

const uploadImageMemory = multer({
  storage: memoryStorage,
  fileFilter: checkFileType,
  limits: { fileSize: 1024 * 1024 * 5 }
})

const uploadImage = multer({
  storage: storage,
  fileFilter: checkFileType,
  limits: { fileSize: 1024 * 1024 * 5 }
})

const uploadXLSX = multer({
  storage: storage,
  fileFilter: checkFileTypeXLSX,
  limits: { fileSize: 1024 * 1024 * 5 }
})

const uploadPDF = multer({
  storage: storage,
  fileFilter: checkFileTypePDF,
  limits: { fileSize: 1024 * 1024 * 5 }
})

function checkFileTypeXLSX(req: any, file: any, callback: any) {
  const fileTypes = /xlsx|xls/
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
  if (extName && file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return callback(null, true)
  } else {
    callback('Error: XLSX Only!')
  }
}

function checkFileTypePDF(req: any, file: any, callback: any) {
  const fileTypes = /pdf/
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
  if (extName && file.mimetype === 'application/pdf') {
    return callback(null, true)
  } else {
    callback('Error: PDF Only!')
  }
}

function checkFileType(req: any, file: any, callback: any) {
  const fileTypes = /jpeg|jpg|png|gif/
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = fileTypes.test(file.mimetype)
  // max size 2mb
  if (file.size > 1024 * 1024 * 2) {
    return callback('Error: Image size must be less than 2MB!')
  }
  if (extName && mimeType) {
    return callback(null, true)
  } else {
    callback('Error: Images Only!')
  }
}

export { uploadImage, uploadXLSX, uploadBinary, uploadPDF, checkFileTypePDF, uploadImageMemory }
