import { Router } from 'express'
import { create, update, get, getById } from '../../controllers/planting.controller'
import { requireUser } from '../../middleware/requireUser'
const router = Router()

router.get('/by-farmland/:farmlandId', requireUser, get)
router.get('/:id', requireUser, getById)
router.post('/', requireUser, create)
router.put('/:id', requireUser, update)
export default router
