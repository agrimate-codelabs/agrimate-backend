import { Router } from 'express'
import { uploadImage } from '../../utils'
import {
  create,
  getAll,
  getById,
  update,
  destroy,
  uploadIcon,
  getIcon,
  deleteIcon
} from '../../controllers/commodity.controller'
import { requireAdmin } from '../../middleware/requireAdmin'
const router = Router()

router.post('/', requireAdmin, create)
router.post('/upload', requireAdmin, uploadImage.single('icon'), uploadIcon)
router.get('/icon/:key', getIcon)
router.delete('/icon/:key', requireAdmin, deleteIcon)
router.get('/', getAll)
router.get('/:id', getById)
router.put('/:id', requireAdmin, update)
router.delete('/:id', requireAdmin, destroy)

export default router
