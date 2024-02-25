import { Router } from 'express'
import {
  getMyCommodity,
  getMyCommodityById,
  updateMyCommodity,
  deleteMyCommodity,
  addToCollector
} from '../../controllers/collector.controller'
import { requireCollector } from '../../middleware/requireCollector'

const router = Router()

router.post('/', requireCollector, addToCollector)
router.get('/', requireCollector, getMyCommodity)
router.get('/:id', requireCollector, getMyCommodityById)
router.put('/:id', requireCollector, updateMyCommodity)
router.delete('/:id', requireCollector, deleteMyCommodity)

export default router
