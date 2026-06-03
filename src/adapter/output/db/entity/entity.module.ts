import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewerEntity } from 'src/adapter/output/db/entity/interviewer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewerEntity])],
})
export class EntityModule {}
