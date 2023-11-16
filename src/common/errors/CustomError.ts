export type ErrorType = {
  type: number;
  message: string;
  extra?: any;
};
class CustomError extends Error {
  name = 'CustomError';
  type: number;
  message: string;
  extra?: any;

  constructor(error: ErrorType, ...params: any[]) {
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
