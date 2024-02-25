import { Router } from 'express'
import { create, cropFailure } from '../../controllers/harvesting.controller'
import { requireFarmer } from '../../middleware/requireFarmer'
const router = Router()

router.post('/', requireFarmer, create)
router.post('/crop-failure', requireFarmer, cropFailure)

export default router
