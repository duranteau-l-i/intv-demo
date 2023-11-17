export enum ErrorType {
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  unprocessableEntity,
  internalServerError,
}

export type ErrorBody = {
  type: ErrorType;
  message: string;
  extra?: any;
};
class CustomError extends Error {
  name = 'CustomError';
  type: ErrorType;
  message: string;
  extra?: any;

  constructor(error: ErrorBody, ...params: any[]) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.type = error.type;
    this.message = error.message;
    if (error?.extra) this.extra = error.extra;
  }
}

export default CustomError;
