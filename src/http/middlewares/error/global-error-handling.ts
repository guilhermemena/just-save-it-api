import {
  type NextFunction,
  type Request,
  type Response,
  type Application,
} from 'express'

import {
  type IErrorResponse,
  CustomError,
  ZodRequestValidatorError,
} from '@/utils/errors/error-handler'

export function globalErrorHandler(app: Application) {
  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ message: `${req.originalUrl} not found` })
  })

  app.use(
    (
      error: IErrorResponse,
      _req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      console.error(error)

      if (error instanceof CustomError) {
        return res.status(error.status_code).json(error.serialize_errors())
      }

      if (error instanceof ZodRequestValidatorError) {
        return res.status(error.status_code).json(error.serialize_errors())
      }

      next()
    },
  )
}
