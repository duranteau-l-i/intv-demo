import CustomError, { ErrorType } from '@common/errors/CustomError';
import UserError from '../domain/error';
import { Role } from '../domain/model';

export const checkIfNotExpires = async (date: number): Promise<void> => {
  const now = Math.floor(new Date().getTime() / 1000);

  if (date < now) {
    throw error;
  }
};

export const checkIfAllows = async (role: Role): Promise<void> => {
  if (role !== Role.admin && role !== Role.editor) {
    throw error;
  }
};

const error = new CustomError({
  type: ErrorType.forbidden,
  message: UserError[ErrorType.forbidden].accessDenied,
});
