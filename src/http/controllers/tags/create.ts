import { type Request, type Response } from 'express'
import { z } from 'zod'

import db from '@/lib/db'
import { tags } from '@/lib/db/schema'
import { ZodRequestValidatorError } from '@/utils/errors/error-handler'

export async function create(req: Request, res: Response) {
  const createTagSchema = z.object({
    name: z.string(),
  })

  const _data = createTagSchema.safeParse(req.body)

  if (!_data.success) {
    throw new ZodRequestValidatorError(_data.error.errors)
  }

  const { name } = _data.data

  const [tag] = await db
    .insert(tags)
    .values({ name, user_id: req.user.sub })
    .returning()

  return res.status(201).json({
    status: 'success',
    data: tag,
  })
}
