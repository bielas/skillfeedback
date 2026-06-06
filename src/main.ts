import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import configuration from 'src/infrastructure/config/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainExceptionFilter } from 'src/infrastructure/filter/domain-exception.filter';

const setupPipes = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};

const setupVersioning = (app: INestApplication) => {
  app.enableVersioning({ type: VersioningType.URI });
};

const setupFilters = (app: INestApplication) => {
  app.useGlobalFilters(new DomainExceptionFilter());
};

const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Skillfeedback API')
    .setDescription('Skillfeedback API description')
    .setVersion('1.0')
    .addTag('v1')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
};

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: ['swagger', 'swagger-json'],
  });

  setupFilters(app);
  setupPipes(app);
  setupVersioning(app);
  setupSwagger(app);

  await app.listen(configuration().port);
};

void bootstrap();
