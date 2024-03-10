import { type Request, type Response } from 'express'
import { z } from 'zod'

import db from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { ZodRequestValidatorError } from '@/utils/errors/error-handler'

export async function create(req: Request, res: Response) {
  const createPostSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    url: z.string(),
    image_url: z.string().optional(),
  })

  const _data = createPostSchema.safeParse(req.body)

  if (!_data.success) {
    throw new ZodRequestValidatorError(_data.error.errors)
  }

  const { title, description, image_url, url } = _data.data

  const [post] = await db
    .insert(posts)
    .values({ title, url, description, image_url, user_id: req.user.sub })
    .returning()

  return res.status(201).json({
    status: 'success',
    data: post,
  })
}
