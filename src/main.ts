import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDocument } from './swagger/swagger';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const dbName = configService.get('DB_DATABASE');

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  SwaggerModule.setup('api', app, createDocument(app));

  logger.verbose(`Application is listening on the port ${port}`);
  logger.verbose(`Application is connected to database ${dbName.toUpperCase()}`);

  await app.listen(port, () => `Server started on port = ${port}`);
}

bootstrap();
