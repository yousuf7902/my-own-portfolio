import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

const expressApp = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.init();
    cachedApp = app;
  }
  return expressApp;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  app(req, res);
}
