import { type Request, type Response } from 'express'
import { z } from 'zod'

import db from '@/lib/db'
import { postOnTags } from '@/lib/db/schema'
import { ZodRequestValidatorError } from '@/utils/errors/error-handler'

export async function create(req: Request, res: Response) {
  const createPostOnTagSchema = z.object({
    post_id: z.string(),
    tag_id: z.string(),
  })

  const _data = createPostOnTagSchema.safeParse(req.body)

  if (!_data.success) {
    throw new ZodRequestValidatorError(_data.error.errors)
  }

  const { post_id, tag_id } = _data.data

  const [postOnTag] = await db
    .insert(postOnTags)
    .values({ post_id, tag_id })
    .returning()

  return res.status(201).json({
    status: 'success',
    data: postOnTag,
  })
}
