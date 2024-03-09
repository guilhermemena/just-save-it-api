import { Router } from 'express'

import { authenticate } from '@/http/middlewares/auth/authenticate'

import { create } from './create'
import { findPosts } from './find-posts'
import { findPost } from './find-post'

const router = Router()

router.use(authenticate)

router.route('/posts').post(create).get(findPosts)

router.route('/posts/:id').get(findPost)

export default { router }
