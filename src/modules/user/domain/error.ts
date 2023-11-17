import { ErrorType } from '../../../common/errors/CustomError';

const UserError = {
  [ErrorType.notFound]: {
    byId: 'User not found',
  },
  [ErrorType.badRequest]: {
    minLength: (value: string) =>
      `The ${value} must be at least three characters long.`,
    notValidEmailAddress: 'Not a valid email address',
    notValidPassword:
      'The password must be at least 6 characters long and contain at least one capital letter and one special character',
  },
};

export default UserError;
