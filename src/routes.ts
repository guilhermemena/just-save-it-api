import { type Express } from 'express'

import authRoutes from '@/http/controllers/auth/routes'
import postRoutes from '@/http/controllers/posts/routes'
import tagsRoutes from '@/http/controllers/tags/routes'
import postTagsRoutes from '@/http/controllers/posts-tags/routes'

export default (app: Express) => {
  app.use('/api/v1', authRoutes.router)
  app.use('/api/v1', postRoutes.router)
  app.use('/api/v1', tagsRoutes.router)
  app.use('/api/v1', postTagsRoutes.router)
}
