import { Router } from 'express'

import { authenticate } from '@/http/middlewares/auth/authenticate'

import { create } from './create'
import { findPosts } from './find-posts'

const router = Router()

router.use(authenticate)

router.route('/posts').post(create).get(findPosts)

export default { router }
