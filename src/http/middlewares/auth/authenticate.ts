import { type NextFunction, type Request, type Response } from 'express'

import { verifyAuthJWT } from '@/lib/jwt'
import { NotAuthorizedError } from '@/utils/errors/error-handler'

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.header('Authorization')

  if (!token) {
    throw new NotAuthorizedError('Please login again.')
  }

  try {
    const decoded = await verifyAuthJWT(token)

    req.user = decoded
    next()
  } catch (error) {
    throw new NotAuthorizedError('Please login again.')
  }
}
