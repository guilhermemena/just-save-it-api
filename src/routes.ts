import { type Express } from 'express'

import authRoutes from '@/http/controllers/auth/routes'
import postRoutes from '@/http/controllers/posts/routes'

export default (app: Express) => {
  app.use('/api/v1', authRoutes.router)
  app.use('/api/v1', postRoutes.router)
}
