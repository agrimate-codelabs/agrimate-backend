import { Router } from 'express'
import { uploadDocument, getDocument, deleteDocument } from '../../controllers/document.controller'
import { uploadPDF } from '../../utils'
import { requireOfftaker } from '../../middleware/requireOfftaker'
const router = Router()

router.post('/upload', requireOfftaker, uploadPDF.single('document'), uploadDocument)
router.get('/:key', requireOfftaker, getDocument)
router.delete('/:key', requireOfftaker, deleteDocument)
export default router
