import { type Request, type Response } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'

import { createAuthJWT } from '@/lib/jwt'
import db from '@/lib/db'
import { NotAuthorizedError } from '@/utils/errors/error-handler'

export async function authenticate(req: Request, res: Response) {
  const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = signInSchema.parse(req.body)

  const userFromEmail = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email)
    },
  })

  if (!userFromEmail) {
    throw new NotAuthorizedError('Invalid email or password')
  }

  const isPasswordValid = await bcrypt.compare(password, userFromEmail.password)

  if (!isPasswordValid) {
    throw new NotAuthorizedError('Invalid email or password')
  }

  const { password: userPassword, ...restUser } = userFromEmail

  const jwt = await createAuthJWT({
    email: userFromEmail.email,
    sub: userFromEmail.id,
  })

  return res.status(200).json({
    status: 'success',
    token: jwt,
    user: restUser,
  })
}
