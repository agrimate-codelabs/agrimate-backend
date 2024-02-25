import { Router } from 'express'

import {authRoutes, regionRoutes, commodityRoutes, collectorRoutes, documentRoutes, myCommodityRoutes, farmerLandRoutes, diseasesPlantRoutes, plantingRoutes, harvestingRoutes, landActivityRoutes, checkPlantRoutes, capitalAssistanceRoutes} from './api'

const router = Router()
router.use('/auth', authRoutes)
router.use('/commodity', commodityRoutes)
router.use('/my-commodity', myCommodityRoutes)
router.use('/region', regionRoutes)
router.use('/collector', collectorRoutes)
router.use('/document', documentRoutes)
router.use('/farmer-land', farmerLandRoutes)
router.use('/diseases-plants', diseasesPlantRoutes)
router.use('/planting', plantingRoutes)
router.use('/harvesting', harvestingRoutes)
router.use('/land-activity', landActivityRoutes)
router.use('/check-plant-health', checkPlantRoutes)
router.use('/capital-assistance', capitalAssistanceRoutes)

export default router 