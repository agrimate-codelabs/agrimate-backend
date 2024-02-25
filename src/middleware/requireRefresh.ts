import { getResponse } from '../utils'
import { NextFunction, Request, Response } from 'express'

export function requireRefresh(req: Request, res: Response, next: NextFunction) {
  if (!req.cookies.AGRIMATE_RT) {
    return getResponse(res, 401, 'Unauthorized', {})
  }
  return next()

}
