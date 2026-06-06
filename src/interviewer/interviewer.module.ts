import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewerEntity } from 'src/interviewer/adapter/output/db/interviewer.entity';
import { InterviewerController } from 'src/interviewer/adapter/input/api/interviewer.controller';
import { InterviewerService } from 'src/interviewer/core/application/interviewer.service';
import { InterviewerRepository } from 'src/interviewer/core/domain/interviewer.repository';
import { InterviewerPostgresRepository } from 'src/interviewer/adapter/output/db/interviewer.postgres.repository';
import { TechnologyModule } from 'src/technology/technology.module';
import { TechnologyEntity } from 'src/technology/adapter/output/db/technology.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InterviewerEntity, TechnologyEntity]),
    TechnologyModule,
  ],
  controllers: [InterviewerController],
  providers: [
    InterviewerService,
    {
      provide: InterviewerRepository,
      useClass: InterviewerPostgresRepository,
    },
  ],
})
export class InterviewerModule {}
