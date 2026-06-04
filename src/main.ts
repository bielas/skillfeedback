import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import configuration from 'src/infrastructure/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(configuration().port);
}
void bootstrap();
