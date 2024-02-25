import { Router } from 'express'
import { uploadImage } from '../../utils'
import {
  uploadThumbnail,
  getThumbnail,
  create,
  getByFarmerId,
  getById,
  deleteThumbnail,
  update,
  destroy,
  getRemainingLandArea
} from '../../controllers/farmerLand.controller'
import { requireFarmer } from '../../middleware/requireFarmer'
const router = Router()

router.post('/upload', requireFarmer, uploadImage.single('image'), uploadThumbnail)
router.get('/thumbnail/:key', getThumbnail)
router.delete('/thumbnail/:key', requireFarmer, deleteThumbnail)
router.post('/', requireFarmer, create)
router.put('/:id', requireFarmer, update)
router.get('/my-farmland', requireFarmer, getByFarmerId)
router.get('/remaining-land-area/:id', requireFarmer, getRemainingLandArea)
router.get('/:id', getById)
router.delete('/:id', destroy)
export default router
