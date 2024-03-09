import { type Express } from 'express'

import authRoutes from '@/http/controllers/auth/routes'

export default (app: Express) => {
  app.use('/api/v1', authRoutes.router)
}
