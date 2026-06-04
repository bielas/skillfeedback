import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/infrastructure/config/app.config';

const typeOrmConfig = TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'postgres',
    host: configuration().database.host,
    port: configuration().database.port,
    username: configuration().database.username,
    password: configuration().database.password,
    database: configuration().database.name,
    autoLoadEntities: true,
    synchronize: true,
  }),
});

@Module({
  imports: [typeOrmConfig],
})
export class DatabaseModule {}
