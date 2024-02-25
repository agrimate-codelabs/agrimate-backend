import { Request, Response, NextFunction } from 'express'
import { verifyJWT, signJWT } from '../config'
import { JWTTokenPayload } from '../types'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

export default async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  // get token from authorization header
  const refreshToken = req.cookies.AGRIMATE_RT
  const accessToken = req.headers.authorization?.split(' ')[1]
  if (!accessToken && !refreshToken) {
    return next()
  }

  // verify access token
  const accessTokenPayload = verifyJWT(accessToken as string)
  const refreshTokenPayload = verifyJWT(refreshToken as string)

  // jika access token tidak valid maka return next()
  if (accessTokenPayload.expired) {
    return next()
  }

  // jika access token masih valid maka set user ke req.user
  if (accessTokenPayload.expired === false) {
    const { id, email, role, userDetail } = accessTokenPayload.payload as JWTTokenPayload
    // Set user to req.user
    req.user = {
      id,
      email,
      role,
      userDetail
    }
    return next()
  }



  // jika access token sudah expired maka cek refresh token dan generate access token baru
  if (accessTokenPayload.expired) {
    if (refreshTokenPayload.payload) {
      const { id, email, role, userDetail } = refreshTokenPayload.payload as JWTTokenPayload
      const user = await prisma.users.findUnique({
        where: {
          id
        }
      })

      if(!user || !user.refreshToken){
        return next()
      }

      const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken)

      if (!refreshTokenMatches) {
        return next()
      }

      if (user) {
        // Set user to req.user
        req.user = {
          id,
          email,
          role,
          userDetail
        }
        return next();
      }
    }
  }
  return next()
}
