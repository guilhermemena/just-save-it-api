import 'express-async-errors'
import express from 'express'

import { globalErrorHandler } from '@/http/middlewares/error/global-error-handling'

import routes from '@/routes'

export const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

routes(app)
globalErrorHandler(app)
