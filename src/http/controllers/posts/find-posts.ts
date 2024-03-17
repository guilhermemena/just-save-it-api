import { type Request, type Response } from 'express'
import { z } from 'zod'
import { sql } from 'drizzle-orm'

import db from '@/lib/db'
import { ZodRequestValidatorError } from '@/utils/errors/error-handler'

export async function findPosts(req: Request, res: Response) {
  const findPostsSchema = z.object({
    limit: z.number().optional().default(10),
    page_index: z.number().optional().default(0),
    tag: z
      .any()
      .optional()
      .transform((value) => {
        if (typeof value === 'undefined') {
          return []
        }

        if (Array.isArray(value)) {
          return value
        }

        return [value]
      }),
  })

  const _data = findPostsSchema.safeParse(req.query)

  if (!_data.success) {
    throw new ZodRequestValidatorError(_data.error.errors)
  }

  const { limit, page_index, tag } = _data.data

  const rawQuery = await db.execute(sql`
    SELECT
      posts.*,
      case when count(tags.id) > 0 then
      json_build_object(
        'id', tags.id,
        'name', tags.name,
        'user_id', tags.user_id,
        'created_at', tags.created_at,
        'updated_at', tags.updated_at
      ) 
      else null
      end as tag
    FROM posts
    LEFT JOIN post_tags ON posts.id = post_tags.post_id
    LEFT JOIN tags ON post_tags.tag_id = tags.id
    WHERE posts.user_id = ${req.user.sub}
    ${
      tag.length
        ? sql`AND EXISTS (
      SELECT post_id from post_tags
      LEFT JOIN tags ON post_tags.tag_id = tags.id
      WHERE post_tags.post_id = posts.id
      ${tag.length ? sql`AND tags.id IN (${tag})` : sql``}
    )`
        : sql``
    }
    GROUP BY posts.id, tags.id
    ORDER BY posts.updated_at DESC
    LIMIT ${limit} OFFSET ${page_index * 10}
  `)

  const postsMap: Record<string, any> = {}

  rawQuery.forEach((row) => {
    const postId: string = (row as { id: string; [key: string]: unknown }).id

    if (!postsMap[postId]) {
      postsMap[postId] = {
        id: row.id,
        title: row.title,
        content: row.content,
        url: row.url,
        image_url: row.image_url,
        user_id: row.user_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
        tags: [],
      }
    }

    if (row.tag) {
      postsMap[postId].tags.push(row.tag)
    }
  })

  const postsArray = Object.values(postsMap)

  return res.status(200).json({
    status: 'success',
    data: postsArray,
  })
}
