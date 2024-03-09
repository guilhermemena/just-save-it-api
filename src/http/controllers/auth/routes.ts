import { Router } from 'express'

import { register } from './register'
import { authenticate } from './authenticate'

const router = Router()

router.route('/register').post(register)
router.route('/authenticate').post(authenticate)

export default { router }
