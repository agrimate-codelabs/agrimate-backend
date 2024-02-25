import { getResponse, getHttpCode } from '../utils'
import { AuthService } from '../service'
import { Request, Response } from 'express'

const authService = new AuthService()

const signUp = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, role, name, phone, provinceId, cityId, districtId, villageId, address } =
    req.body
  let data: any
  switch (role) {
    case 'collector':
    case 'farmer':
      data = { name, phone, provinceId, cityId, districtId, villageId, address }
      break
    case 'offtaker':
      const { companyName, nib, document } = req.body
      data = { name, phone, provinceId, cityId, districtId, villageId, address, nib, document, companyName }
      break
    default:
      return getResponse(res, 400, 'Invalid role', 'error')
  }
  const result = await authService.signUp(email, password, confirmPassword, role, data)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(
    res,
    getHttpCode.OK,
    'Berhasil Membuat Akun, Silahkan Cek Email Untuk Verifikasi Akun',
    result.data
  )
}

const signIn = async (req: Request, res: Response) => {
  const { email, password, deviceToken } = req.body
  const result = await authService.signIn(email, password, deviceToken)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }

  res.cookie('AGRIMATE_RT', result.data.refreshToken, {
    secure: true,
    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
  })

  return getResponse(res, getHttpCode.OK, 'Berhasil Login', result.data)
}

const verify = async (req: Request, res: Response) => {
  const token = req.body.token as string  
  const id = req.body.userId as string
  const result = await authService.verifyEmail(token, id)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil Verifikasi Akun', result.data)
}

const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const userDetail = req.user?.userDetail
    const result = await authService.logout(userId, userDetail)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil Logout', result.data)
  } catch (error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal Logout', error)
  }
}

const checkOtp = async (req: Request, res: Response) => {
  try{
    const { otp } = req.body
    const result = await authService.checkOtp(otp)
    if (result.status === 'failed') {
      return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
    }
    return getResponse(res, getHttpCode.OK, 'Berhasil Verifikasi OTP', result.data)    
  }catch(error) {
    return getResponse(res, getHttpCode.INTERNAL_SERVER_ERROR, 'Gagal Verifikasi OTP', error)
  }
}

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body
  const result = await authService.forgotPassword(email)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil Mengirim Email', result.data)
}

const resetPassword = async (req: Request, res: Response) => {
  const { userId, password, confirmPassword } = req.body
  const result = await authService.resetPassword({ userId, password, confirmPassword })
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil Mereset Password', result.data)
}

const currentUser = async (req: Request, res: Response) => {
  const user = req.user
  return getResponse(res, getHttpCode.OK, 'Berhasil Mendapatkan Data User', user)
}

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.AGRIMATE_RT
  console.log('refreshToken', refreshToken)
  const result = await authService.refreshToken(refreshToken)
  if (result.status === 'failed') {
    return getResponse(res, getHttpCode.UNPROCESSABLE_ENTITY, result.data, null)
  }
  return getResponse(res, getHttpCode.OK, 'Berhasil Refresh Token', result.data)
}

export { signUp, signIn, verify, logout, forgotPassword, resetPassword, currentUser, refreshToken, checkOtp }
