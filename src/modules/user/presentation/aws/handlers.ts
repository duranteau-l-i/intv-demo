/* eslint-disable @typescript-eslint/no-unused-vars */
import { Callback, Context } from 'aws-lambda';

import { getApp } from 'src/serverless';
import UserHandlers from './userHandlers';
import AuthHandlers from './authHandlers';

const handlersUserList = [
  'getUsers',
  'getMe',
  'getUserById',
  'createUser',
  'updateUser',
  'removeUser',
];

const handlersUser = handlersUserList.reduce(
  (acc, handler) => ({
    ...acc,
    [handler]: async (event: any, context: Context, callback: Callback) => {
      const app = await getApp();
      const userHandlers = app.get(UserHandlers);

      return await userHandlers[handler](event);
    },
  }),
  {},
);

const handlersAuthList = ['signUp', 'signIn', 'logOut', 'refreshTokens'];

const handlersAuth = handlersAuthList.reduce(
  (acc, handler) => ({
    ...acc,
    [handler]: async (event: any, context: Context, callback: Callback) => {
      const app = await getApp();
      const userHandlers = app.get(AuthHandlers);

      return await userHandlers[handler](event);
    },
  }),
  {},
);

export { handlersUser, handlersAuth };
