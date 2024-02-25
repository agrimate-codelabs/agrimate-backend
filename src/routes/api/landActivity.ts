import { Router } from 'express'
import { get, getById, create, update, upload, getFile, deleteImage } from '../../controllers/landActivity.controller'
import { uploadImage } from '../../utils'
import { requireFarmer } from '../../middleware/requireFarmer'
const router = Router()

router.post('/', requireFarmer, create)
router.put('/:id', requireFarmer, update)
router.get('/:plantingId', requireFarmer, get)
router.get('/detail/:id', requireFarmer, getById)
router.get('/image/:key', getFile)
router.delete('/image/:key', requireFarmer, deleteImage)
router.post('/upload', requireFarmer, uploadImage.single('image'), upload)

export default router
