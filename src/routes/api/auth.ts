import { Router } from 'express'
import {
  signUp,
  signIn,
  verify,
  logout,
  forgotPassword,
  resetPassword,
  currentUser,
  refreshToken,
  checkOtp
} from '../../controllers/auth.controller'
import { requireUser } from '../../middleware/requireUser'
import { requireRefresh } from '../../middleware/requireRefresh'
const router = Router()

router.post('/signUp', signUp)
router.post('/verify', verify)
router.post('/signIn', signIn)
router.post('/logout', requireUser, logout)
router.post('/forgot-password', forgotPassword)
router.post('/check-otp', checkOtp)
router.post('/reset-password', resetPassword)
router.get('/current-user', requireUser, currentUser)
router.post('/refresh-token', requireRefresh, refreshToken)
export default router
