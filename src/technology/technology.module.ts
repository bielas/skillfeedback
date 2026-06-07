import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologyController } from './adapter/input/api/technology.controller';
import { TechnologyPostgresRepository } from './adapter/output/db/technology.postgres.repository';
import { TechnologyEntity } from './adapter/output/db/technology.entity';
import { TechnologyRepository } from './core/domain/technology.repository';
import { CreateTechnologyHandler } from './core/application/handler/create-technology.handler';
import { ActivateTechnologyHandler } from './core/application/handler/activate-technology.handler';
import { DeactivateTechnologyHandler } from './core/application/handler/deactivate-technology.handler';
import { GetAllTechnologiesHandler } from './core/application/handler/get-all-technologies.handler';
import { GetTechnologyHandler } from './core/application/handler/get-technology.handler';
import { GetTechnologiesByIdsHandler } from './core/application/handler/get-technologies-by-ids.handler';

const CommandHandlers = [
  CreateTechnologyHandler,
  ActivateTechnologyHandler,
  DeactivateTechnologyHandler,
];

const QueryHandlers = [
  GetAllTechnologiesHandler,
  GetTechnologyHandler,
  GetTechnologiesByIdsHandler,
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([TechnologyEntity])],
  controllers: [TechnologyController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: TechnologyRepository,
      useClass: TechnologyPostgresRepository,
    },
  ],
  exports: [CqrsModule, TechnologyRepository],
})
export class TechnologyModule {}
