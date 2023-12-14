import { Callback, Context } from 'aws-lambda';
import { getApp } from 'src/handler';
import UserHandlers from './userHandlers';

const handlersList = [
  'getUsers',
  'getMe',
  'getUserById',
  'createUser',
  'updateUser',
  'removeUser',
];

const list = handlersList.reduce(
  (acc, handler) => ({
    ...acc,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [handler]: async (event: any, context: Context, callback: Callback) => {
      const app = await getApp();
      const userHandlers = app.get(UserHandlers);

      return await userHandlers[handler](event);
    },
  }),
  {},
);

export { list };
