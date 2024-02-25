import { Router } from 'express'
import { check } from '../../controllers/checkPlant.controller'
import { uploadBinary } from '../../utils'
const router = Router()

router.post('/', uploadBinary.single('file'), check)

export default router
