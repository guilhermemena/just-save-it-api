import * as jose from 'jose'

import { env } from '@/env'
import { NotAuthorizedError } from '@/utils/errors/error-handler'

export type JWTPayload = {
  sub: string
  email: string
}

export const createAuthJWT = async (payload: JWTPayload) => {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(new TextEncoder().encode(env.JWT_SECRET))
  return jwt
}

export const verifyAuthJWT = async (jwt: string) => {
  try {
    const { payload } = await jose.jwtVerify(
      jwt,
      new TextEncoder().encode(env.JWT_SECRET),
    )

    return payload as JWTPayload
  } catch (error) {
    throw new NotAuthorizedError('Token is invalid. Please log in again.')
  }
}
