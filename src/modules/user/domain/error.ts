import { ErrorType } from '../../../common/errors/CustomError';

const UserError = {
  [ErrorType.notFound]: {
    byId: 'User not found',
  },
};

export default UserError;
