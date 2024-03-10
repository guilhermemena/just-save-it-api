import { Router } from 'express'

import { authenticate } from '@/http/middlewares/auth/authenticate'

import { create } from './create'
import { deletePostTag } from './delete'

const router = Router()

router.use(authenticate)

router.route('/post-tags').post(create)

router.route('/post-tags/:id').delete(deletePostTag)

export default { router }
