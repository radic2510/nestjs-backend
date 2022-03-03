import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from "./http-exception.filter";
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import passport from "passport";
import session from 'express-session';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true});

  // HttpExceptionFilter 적용
  app.useGlobalFilters(new HttpExceptionFilter());

  // Validation Pipe
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  // CORS enable
  app.enableCors({
    origin: true,
    credentials: true
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('nest backend API')
    .setDescription('nest backend를 위한 API 문서입니다.')
    .setVersion('0.1')
    .addTag('nest')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Logger - Pino
  app.useLogger(app.get(Logger));

  app.use(cookieParser());
  app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
          htppOnly: true
        }
      })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`listen on port ${port}`)

  // Hot Reload
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
