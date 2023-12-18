import { NestFactory } from '@nestjs/core';
import {
  INestApplicationContext,
  // ValidationPipe
} from '@nestjs/common';
// import serverlessExpress from '@vendia/serverless-express';
// import { Callback, Context, Handler } from 'aws-lambda';

import { AppModule } from './app.module';

// let serverlessApp: Handler;

// export const handler = async (event: any, context: Context, callback: Callback) => {
//   if (!serverlessApp) {
//     const app = await NestFactory.create(AppModule);
//     app.useGlobalPipes(new ValidationPipe());
//     app.enableCors();
//     await app.init();

//     const expressApp = app.getHttpAdapter().getInstance();
//     serverlessApp = serverlessExpress({ app: expressApp });
//   }

//   return serverlessApp(event, context, callback);
// };

let serverlessApp: INestApplicationContext;

export const getApp = async () => {
  if (!serverlessApp) {
    serverlessApp = await NestFactory.createApplicationContext(AppModule);
  }

  return serverlessApp;
};
