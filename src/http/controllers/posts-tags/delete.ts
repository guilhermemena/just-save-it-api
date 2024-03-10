import { type Request, type Response } from 'express'
import { z } from 'zod'

import db from '@/lib/db'
import { postOnTags } from '@/lib/db/schema'
import { ZodRequestValidatorError } from '@/utils/errors/error-handler'
import { eq } from 'drizzle-orm'

export async function deletePostTag(req: Request, res: Response) {
  const deletePostOnTagSchema = z.object({
    id: z.string().uuid(),
  })

  const _data = deletePostOnTagSchema.safeParse(req.body)

  if (!_data.success) {
    throw new ZodRequestValidatorError(_data.error.errors)
  }

  const { id } = _data.data

  await db.delete(postOnTags).where(eq(postOnTags.id, id))

  return res.status(204).json({
    status: 'success',
  })
}
