import { Router } from 'express'

import { authenticate } from '@/http/middlewares/auth/authenticate'

import { create } from './create'

const router = Router()

router.use(authenticate)

router.route('/tags').post(create)

export default { router }
