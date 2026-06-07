import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewerEntity } from 'src/interviewer/adapter/output/db/interviewer.entity';
import { InterviewerController } from 'src/interviewer/adapter/input/api/interviewer.controller';
import { InterviewerRepository } from 'src/interviewer/core/domain/interviewer.repository';
import { InterviewerPostgresRepository } from 'src/interviewer/adapter/output/db/interviewer.postgres.repository';
import { TechnologyModule } from 'src/technology/technology.module';
import { TechnologyEntity } from 'src/technology/adapter/output/db/technology.entity';
import { CreateInterviewerHandler } from './core/application/handler/create-interviewer.handler';
import { UpdateInterviewerDetailsHandler } from './core/application/handler/update-interviewer-details.handler';
import { AddTechnologyToInterviewerHandler } from './core/application/handler/add-technology-to-interviewer.handler';
import { RemoveTechnologyFromInterviewerHandler } from './core/application/handler/remove-technology-from-interviewer.handler';
import { ActivateInterviewerHandler } from './core/application/handler/activate-interviewer.handler';
import { DeactivateInterviewerHandler } from './core/application/handler/deactivate-interviewer.handler';
import { GetAllInterviewersHandler } from './core/application/handler/get-all-interviewers.handler';
import { GetInterviewerHandler } from './core/application/handler/get-interviewer.handler';

const CommandHandlers = [
  CreateInterviewerHandler,
  UpdateInterviewerDetailsHandler,
  AddTechnologyToInterviewerHandler,
  RemoveTechnologyFromInterviewerHandler,
  ActivateInterviewerHandler,
  DeactivateInterviewerHandler,
];

const QueryHandlers = [GetAllInterviewersHandler, GetInterviewerHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([InterviewerEntity, TechnologyEntity]),
    TechnologyModule,
  ],
  controllers: [InterviewerController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: InterviewerRepository,
      useClass: InterviewerPostgresRepository,
    },
  ],
})
export class InterviewerModule {}
