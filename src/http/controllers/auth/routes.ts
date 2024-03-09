import { Router } from 'express'

import { register } from './register'
import { authenticate } from './authenticate'

const router = Router()

router.route('/auth/register').post(register)
router.route('/auth/authenticate').post(authenticate)

export default { router }
