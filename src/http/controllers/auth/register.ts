import { type Request, type Response } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'

import { createAuthJWT } from '@/lib/jwt'
import db from '@/lib/db'
import { users } from '@/lib/db/schema'
import {
  BadRequestError,
  ZodRequestValidatorError,
} from '@/utils/errors/error-handler'

export async function register(req: Request, res: Response) {
  const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const _data = signUpSchema.safeParse(req.body)

  if (!_data.success) {
    throw new ZodRequestValidatorError(_data.error.errors)
  }

  const { email, password } = _data.data

  const userFromEmail = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email)
    },
  })

  if (userFromEmail) {
    // TODO: Create a custom error for this, status code 409
    throw new BadRequestError('User already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const [user] = await db
    .insert(users)
    .values({ email, password: hashedPassword })
    .returning()

  const { password: userPassword, ...restUser } = user

  const jwt = await createAuthJWT({ email: user.email, sub: user.id })

  return res.status(201).json({
    status: 'success',
    token: jwt,
    user: restUser,
  })
}
