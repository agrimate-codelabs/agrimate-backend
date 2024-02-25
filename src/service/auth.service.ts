import type { FarmerInput, OfftakerInput, CollectorInput, ResetPasswordInput } from '../types'
import { v4 as uuidv4 } from 'uuid'
import {
  signUpSchema,
  signInSchema,
  verifyAccountSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  checkOtpSchema
} from '../utils/validator'
import { errorHandle, sendMail } from '../utils'
import { indonesiaPhoneNumberFormat } from '../helper'
import { signJWT, verifyJWT } from '../config/jwt'
import {
  UserVerificationTokenRepository,
  ChangePasswordTokenRepository,
  FarmerDeviceRepository,
  CollectorDeviceRepository
} from '../repository'
import { UserService } from './user.service'
import { FarmerService } from './farmer.service'
import { CollectorService } from './collector.service'
import { OfftakerService } from './offtaker.service'
import { CompanyService } from './company.service'
import { CompanyDocumentService } from './companyDocument.service'
import { BaseService } from './base.service'
const changePasswordTokenRepository = new ChangePasswordTokenRepository()
const userVerificationTokenRepository = new UserVerificationTokenRepository()
const farmerDeviceRepository = new FarmerDeviceRepository()
const collectorDeviceRepository = new CollectorDeviceRepository()
export class AuthService extends BaseService {
  constructor(
    private readonly userService = new UserService(),
    private readonly farmerService = new FarmerService(),
    private readonly collectorService = new CollectorService(),
    private readonly offtakerService = new OfftakerService(),
    private readonly companyService = new CompanyService(),
    private readonly companyDocumentService = new CompanyDocumentService(),
    private readonly changePasswordTokenRepository = new ChangePasswordTokenRepository()
  ) {
    super('')
  }

  async refreshToken(refreshToken: string) {
    try {
      // Find user by refresh token
      const decodedRefreshToken = verifyJWT(refreshToken)
      if (decodedRefreshToken === null || decodedRefreshToken.expired) {
        return this.failedOrSuccessRequest('failed', 'Token tidak valid')
      } else {
        const payload: any = decodedRefreshToken.payload
        const user = await this.userService.findById(payload.id)
        if (!user) {
          return this.failedOrSuccessRequest('failed', 'User tidak Ada')
        }
        const checkRefreshToken = this.argonVerify(refreshToken, user.data.refreshToken)
        if (!checkRefreshToken) {
          return this.failedOrSuccessRequest('failed', 'Token Tidak Cocok')
        }
        const accessToken = signJWT(
          {
            id: user.data.id,
            email: user.data.email,
            role: user.data.roles,
            userDetail: payload.userDetail
          },
          '30m'
        )
        return this.failedOrSuccessRequest('success', { accessToken })
      }
    } catch (error) {
      console.log(error)
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async signUp(email: string, password: string, confirmPassword: string, role: string, data: any) {
    const validateArgs = signUpSchema.safeParse({ email, password, confirmPassword, role, data })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    const hashedPassword = await this.hashData(password)
    const phoneNumber = indonesiaPhoneNumberFormat(data.phone)

    // check email
    const checkEmail = await this.userService.findUserByEmail(email)
    if (checkEmail) {
      return this.failedOrSuccessRequest('failed', 'Email sudah terdaftar')
    }

    // TODO: create user
    let user
    try {
      user = await this.userService.create({ email, role, password: hashedPassword })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', 'Gagal membuat user')
    }

    // TODO: Create the userVerificationToken to database
    let resultUVTReq
    try {
      const userVerificationToken = uuidv4() + '-' + new Date().getTime()
      const token = userVerificationToken
      const expires = new Date(new Date().getTime() + 30 * 60 * 1000)
      ;(resultUVTReq = await userVerificationTokenRepository.createUserVerificationToken({
        expires,
        token,
        userId: user.id
      })),
        // manipulate data
        (resultUVTReq = {
          ...resultUVTReq,
          name: data.name
        })
    } catch (error) {
      await this.userService.delete(user.id)
    }

    if (!resultUVTReq) {
      return this.failedOrSuccessRequest('failed', 'Gagal membuat token user')
    }

    try {
      switch (role) {
        case 'farmer':
          await this.farmerService.create({ ...data, userId: user.id, phone: phoneNumber })
          break
        case 'collector':
          await this.collectorService.create({ ...data, userId: user.id, phone: phoneNumber })
          break
        case 'offtaker':
          const offtaker = await this.offtakerService.create({ userId: user.id, name: data.name, phone: phoneNumber })
          const company = await this.companyService.create({
            offtakerId: offtaker.id,
            nib: data.nib,
            name: data.companyName,
            provinceId: data.provinceId,
            cityId: data.cityId,
            districtId: data.districtId,
            villageId: data.villageId,
            address: data.address
          })
          await this.companyDocumentService.create({
            companyId: company.id,
            name: 'Surat Izin Usaha Perkebunan',
            document: data.document
          })
          break
        default:
          return this.failedOrSuccessRequest('failed', 'Invalid role')
      }
    } catch (error) {
      await userVerificationTokenRepository.deleteUserVerificationToken(resultUVTReq.id)
      await this.userService.delete(user.id)
      return this.failedOrSuccessRequest('failed', 'Gagal membuat user sesuai role')
    }

    // send email verification
    try {
      sendMail(email, 'Verifikasi Email', resultUVTReq, 'verify-email')
      return this.failedOrSuccessRequest('success', {})
    } catch (error) {
      await userVerificationTokenRepository.deleteUserVerificationToken(resultUVTReq.id)
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async verifyEmail(token: string, id: string) {
    const validateArgs = verifyAccountSchema.safeParse({ token, id })
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try {
      const userVerificationToken = await userVerificationTokenRepository.findUserVerificationTokenByToken(token)
      if (!userVerificationToken) {
        return this.failedOrSuccessRequest('failed', 'Token tidak valid')
      }
      // check token expires
      if (new Date() > userVerificationToken.expires) {
        await userVerificationTokenRepository.deleteUserVerificationToken(userVerificationToken.id)
        return this.failedOrSuccessRequest('failed', 'Token sudah kadaluarsa')
      }
      const verify = await this.userService.verifyUser(id)
      if (!verify) {
        return this.failedOrSuccessRequest('failed', 'Gagal verifikasi')
      }
      await userVerificationTokenRepository.deleteUserVerificationToken(userVerificationToken.id)
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
    return this.failedOrSuccessRequest('success', {})
  }

  async signIn(email: string, password: string, deviceToken: string) {
    try {
      // Validate input arguments
      const validateArgs = signInSchema.safeParse({ email, password })
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
      }

      // Find user by email
      const user = await this.userService.findUserByEmail(email)
      if (!user) {
        return this.failedOrSuccessRequest('failed', 'Email atau password salah')
      }

      // Check if the user's email is verified
      if (!user.is_verified) {
        return this.failedOrSuccessRequest('failed', 'Email belum terverifikasi')
      }

      // Check user's password
      const isPasswordValid = await this.argonVerify(password, user.password)
      if (!isPasswordValid) {
        return this.failedOrSuccessRequest('failed', 'Email atau password salah')
      }

      let userDetail
      switch (user.roles) {
        case 'farmer':
          userDetail = await this.farmerService.findFarmerByUserId(user.id)
          break
        case 'collector':
          userDetail = await this.collectorService.findCollectorByUserId(user.id)
          break
        case 'offtaker':
          userDetail = await this.offtakerService.findOfftakerByUserId(user.id)
          break
        case 'admin':
          userDetail = await this.userService.findById(user.id)
          break
        default:
          return this.failedOrSuccessRequest('failed', 'Invalid role')
      }

      // Handle invalid user details
      if (!userDetail) {
        return this.failedOrSuccessRequest('failed', 'Email atau password salah')
      }

      // Find or create device token
      if (user.roles === 'collector' || user.roles === 'farmer') {
        let deviceTokenRepository = user.roles === 'farmer' ? farmerDeviceRepository : collectorDeviceRepository
        const checkDeviceToken = await deviceTokenRepository.findDeviceTokenByUserDetailId(userDetail.id)
        if (!checkDeviceToken) {
          await deviceTokenRepository.createDeviceToken(deviceToken, userDetail.id)
        } else {
          await deviceTokenRepository.updateDeviceToken(checkDeviceToken.id, deviceToken)
        }
      }

      // Manipulate userDetail data
      let manipulatedUserDetail = null
      switch (user.roles) {
        case 'farmer':
          manipulatedUserDetail = { farmerId: userDetail.id, name: userDetail.name }
          break
        case 'collector':
          manipulatedUserDetail = { collectorId: userDetail.id, name: userDetail.name }
          break
        case 'offtaker':
          manipulatedUserDetail = { offtakerId: userDetail.id, name: userDetail.name }
          break
        case 'admin':
          manipulatedUserDetail = { adminId: userDetail.data.id, name: userDetail.data.email }
          break
        default:
          return this.failedOrSuccessRequest('failed', 'Invalid role')
      }

      // Create JWT tokens
      const tokenPayload = { id: user.id, email: user.email, role: user.roles, userDetail: manipulatedUserDetail }
      const accessToken = signJWT(tokenPayload, '30m')
      const refreshToken = signJWT(tokenPayload, '1d')

      // Save refresh token to the database
      const hashedRefreshToken = await this.hashData(refreshToken)
      await this.userService.updateUserLogin(user.id, hashedRefreshToken)

      return this.failedOrSuccessRequest('success', { accessToken, refreshToken })
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async logout(userId: string, userDetail: any) {
    try {
      // Check user has session
      const user = await this.userService.findById(userId)
      if (user.data.refreshToken === null) {
        return this.failedOrSuccessRequest('failed', 'Kamu Tidak Login')
      }
      switch (user.roles) {
        case 'farmer':
          // find device token by farmer id
          const deviceToken = await farmerDeviceRepository.findDeviceTokenByUserDetailId(userDetail?.farmerId)
          if (!deviceToken) {
            return this.failedOrSuccessRequest('failed', 'Gagal logout')
          }
          // empty device token
          await farmerDeviceRepository.emptyDeviceToken(deviceToken.id)
          break
        case 'collector':
          // find device token by collector id
          const collectorDeviceToken = await collectorDeviceRepository.findDeviceTokenByUserDetailId(
            userDetail?.collectorId
          )
          if (!collectorDeviceToken) {
            return this.failedOrSuccessRequest('failed', 'Gagal logout')
          }
          // empty device token
          await collectorDeviceRepository.emptyDeviceToken(collectorDeviceToken.id)
          break
      }
      await this.userService.userLogout(user.data.id)
      return this.failedOrSuccessRequest('success', {})
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async forgotPassword(email: string) {
    try {
      // Validate input
      const validateArgs = forgotPasswordSchema.safeParse({ email })
      if (!validateArgs.success) {
        return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
      }

      // Find user by email
      const user = await this.userService.findUserByEmail(email)
      if (!user) {
        return this.failedOrSuccessRequest('failed', 'Email tidak terdaftar')
      }

      // Generate token
      const changePasswordToken = this.generateUniqueToken()
      const maxRequestsPerDay = 3
      const countRequest = await this.changePasswordTokenRepository.countChangePasswordTokenPerDayByUserId(
        user.id,
        new Date()
      )
      if (countRequest >= maxRequestsPerDay) {
        return this.failedOrSuccessRequest('failed', 'Batas maksimal permintaan reset password telah tercapai')
      }

      // Set token expiration time
      const expiresTime = 30 * 60 * 1000 // 30 minutes
      const tokenExpiration = new Date(Date.now() + expiresTime)

      // Create token
      const resultUVTReq = await this.changePasswordTokenRepository.createChangePasswordToken({
        expires: tokenExpiration,
        token: changePasswordToken,
        userId: user.id
      })

      if (!resultUVTReq) {
        return this.failedOrSuccessRequest('failed', 'Gagal membuat user')
      }

      try {
        await sendMail(email, 'Reset Password', changePasswordToken, 'forgot-password')
        return this.failedOrSuccessRequest('success', {})
      } catch (error) {
        await this.changePasswordTokenRepository.deleteChangePasswordToken(resultUVTReq.id)
        return this.failedOrSuccessRequest('failed', error)
      }
    } catch (error) {
      return this.failedOrSuccessRequest('failed', error)
    }
  }

  async resetPassword(payload: ResetPasswordInput) {
    const validateArgs = changePasswordSchema.safeParse(payload)
    if (!validateArgs.success) {
      return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    }
    try {
      const hashedPassword = await this.hashData(payload.password)
      await this.userService.changePassword(payload.userId, hashedPassword)
      return this.failedOrSuccessRequest('success', {})
    } catch (error) {
      console.log(error)
      return this.failedOrSuccessRequest('failed', error)
    }
  }
  async checkOtp(otp: string) {
    const validateArgs = checkOtpSchema.safeParse({ otp })
    if(!validateArgs.success) return this.failedOrSuccessRequest('failed', errorHandle(validateArgs.error))
    const checkToken = await this.changePasswordTokenRepository.findChangePasswordTokenByToken(otp)
    if (!checkToken) {
      return this.failedOrSuccessRequest('failed', 'OTP tidak valid')
    }
    // check token expires
    if (new Date() > checkToken.expires) {
      await this.changePasswordTokenRepository.deleteChangePasswordToken(checkToken.id)
      return this.failedOrSuccessRequest('failed', 'Token sudah kadaluarsa')
    }
    await this.changePasswordTokenRepository.deleteChangePasswordToken(checkToken.id)
    return this.failedOrSuccessRequest('success', checkToken)
  }
}
