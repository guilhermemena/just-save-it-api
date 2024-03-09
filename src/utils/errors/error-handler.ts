export interface IErrorResponse {
  message: string
  status_code: number
  status: string
  serialize_errors: () => IError
}

export interface IError {
  message: string
  status: string
}

export abstract class CustomError extends Error {
  abstract status_code: number
  abstract status: string

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  serialize_errors(): IError {
    return {
      message: this.message,
      status: this.status,
    }
  }
}

export class BadRequestError extends CustomError {
  status_code = 400
  status = 'error'

  constructor(public message: string) {
    super(message)
  }
}

export class NotAuthorizedError extends CustomError {
  status_code = 401
  status = 'error'

  constructor(public message: string) {
    super(message)
  }
}

export class NotFoundError extends CustomError {
  status_code = 404
  status = 'error'

  constructor(public message: string) {
    super(message)
  }
}

type IZodError = {
  message: string
  path: Array<string | number>
}

export class ZodRequestValidatorError extends Error {
  status_code = 400
  status = 'error'

  // eslint-disable-next-line n/handle-callback-err
  constructor(public error: IZodError[]) {
    super()
  }

  serialize_errors() {
    return {
      status: this.status,
      errors: this.error.map((err) => {
        return { message: err.message, field: err.path.join('.') }
      }),
    }
  }
}
