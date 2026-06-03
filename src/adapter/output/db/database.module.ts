import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityModule } from 'src/adapter/output/db/entity/entity.module';
import configuration from 'src/config/app.config';

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
  imports: [EntityModule, typeOrmConfig],
})
export class DatabaseModule {}
