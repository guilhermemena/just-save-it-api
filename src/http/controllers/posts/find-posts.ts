import { type Request, type Response } from 'express'
import { z } from 'zod'

import db from '@/lib/db'
import { ZodRequestValidatorError } from '@/utils/errors/error-handler'

export async function findPosts(req: Request, res: Response) {
  const findPostsSchema = z.object({
    limit: z.number().optional().default(10),
    offset: z.number().optional().default(0),
  })

  const _data = findPostsSchema.safeParse(req.query)

  if (!_data.success) {
    throw new ZodRequestValidatorError(_data.error.errors)
  }

  const { limit, offset } = _data.data

  const _posts = await db.query.posts.findMany({
    limit,
    offset,
    orderBy: (posts, { desc }) => [desc(posts.updated_at)],
    with: {
      postTags: {
        with: {
          tag: true,
        },
      },
    },
  })

  return res.status(200).json({
    status: 'success',
    data: _posts,
  })
}
