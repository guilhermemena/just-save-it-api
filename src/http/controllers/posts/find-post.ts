import { type Request, type Response } from 'express'
import { z } from 'zod'

import db from '@/lib/db'
import {
  ZodRequestValidatorError,
  NotFoundError,
} from '@/utils/errors/error-handler'

export async function findPost(req: Request, res: Response) {
  const findPostsSchema = z.object({
    id: z.string().uuid(),
  })

  const _data = findPostsSchema.safeParse(req.params)

  if (!_data.success) {
    throw new ZodRequestValidatorError(_data.error.errors)
  }

  const { id } = _data.data

  const post = await db.query.posts.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id)
    },
  })

  if (!post) {
    throw new NotFoundError(`Post with the given id was not found: ${id}`)
  }

  return res.status(200).json({
    status: 'success',
    data: post,
  })
}
