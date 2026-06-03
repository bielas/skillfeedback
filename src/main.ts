import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from 'src/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(configuration().port);
}
bootstrap();
