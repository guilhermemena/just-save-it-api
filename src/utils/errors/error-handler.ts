export interface IErrorResponse {
  message: string
  status_code: number
  status: string
  serialize_errors: () => IError
}

export interface IError {
  message: string
  status_code: number
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
      status_code: this.status_code,
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
