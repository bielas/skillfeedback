import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologyController } from './adapter/input/api/technology.controller';
import { TechnologyService } from './core/application/technology.service';
import { TechnologyPostgresRepository } from './adapter/output/db/technology.postgres.repository';
import { TechnologyEntity } from './adapter/output/db/technology.entity';
import { TechnologyRepository } from './core/domain/technology.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TechnologyEntity])],
  controllers: [TechnologyController],
  providers: [
    TechnologyService,
    {
      provide: TechnologyRepository,
      useClass: TechnologyPostgresRepository,
    },
  ],
  exports: [TechnologyService],
})
export class TechnologyModule {}
