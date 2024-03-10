import { type Request, type Response } from 'express'

import db from '@/lib/db'

export async function findTags(req: Request, res: Response) {
  const _tags = await db.query.tags.findMany({
    orderBy: (tags, { asc }) => [asc(tags.name)],
  })

  return res.status(200).json({
    status: 'success',
    data: _tags,
  })
}
