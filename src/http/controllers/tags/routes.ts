import { Router } from 'express'

import { authenticate } from '@/http/middlewares/auth/authenticate'

import { create } from './create'
import { findTags } from './find-tags'

const router = Router()

router.use(authenticate)

router.route('/tags').post(create).get(findTags)

export default { router }
