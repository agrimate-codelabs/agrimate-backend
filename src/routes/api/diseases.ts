import { Router } from 'express'
import {
  createDiseases,
  getAllDiseases,
  updateDiseases,
  deleteDiseases,
  uploadImage as upload,
  getImage,
  deleteImage
} from '../../controllers/diseases.controller'
import { uploadImage } from '../../utils'
const router = Router()
router.get('/', getAllDiseases)
router.post('/upload', uploadImage.single('image'), upload)
router.get('/thumbnail/:key', getImage)
router.delete('/thumbnail/:key', deleteImage)
router.post('/', createDiseases)
router.put('/:id', updateDiseases)
router.delete('/:id', deleteDiseases)

export default router
