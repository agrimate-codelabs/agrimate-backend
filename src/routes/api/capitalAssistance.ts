import { Router } from 'express'

import { requireUser } from '../../middleware/requireUser'
import { uploadImage } from '../../utils'
import { upload, create } from '../../controllers/capitalAssistance.controller'

const router = Router()

router.post('/', requireUser, create)
router.post('/upload', requireUser, uploadImage.fields([{ name: 'ktp_photo', maxCount: 1 }, {name: 'farmer_photo', maxCount: 1}]), upload)
export default router