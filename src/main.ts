import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './helpers/interceptors/response-transform.interceptor';
import { AllExceptionsFilter } from './helpers/filters/exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ? Number(process.env.PORT) : 8082;
  app.setGlobalPrefix('api/v1');

  const httpRef = app.getHttpAdapter().getHttpServer();
  app.useGlobalFilters(new AllExceptionsFilter(httpRef, new Logger()));

  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  await app.listen(port, () => console.log('App started on port ', port));
}
bootstrap();
