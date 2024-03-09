import { Router } from 'express'

import { authenticate } from '@/http/middlewares/auth/authenticate'

import { create } from './create'

const router = Router()

router.route('/posts').post(authenticate, create)

export default { router }
