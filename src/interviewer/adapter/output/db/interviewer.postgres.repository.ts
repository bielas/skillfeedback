import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InterviewerRepository } from 'src/interviewer/core/domain/interviewer.repository';
import { Interviewer } from 'src/interviewer/core/domain/interviewer';
import { BusinessId } from 'src/shared/id/businessId';
import {
  InterviewerEntity,
  toDomain,
  toEntity,
} from 'src/interviewer/adapter/output/db/interviewer.entity';

@Injectable()
export class InterviewerPostgresRepository implements InterviewerRepository {
  constructor(
    @InjectRepository(InterviewerEntity)
    private readonly repo: Repository<InterviewerEntity>,
  ) {}
  async create(interviewer: Interviewer): Promise<Interviewer> {
    const entity = toEntity(interviewer);
    const saved = await this.repo.save(entity);
    return toDomain(saved);
  }
  delete(businessId: BusinessId): Promise<void> {
    throw new Error('Method not implemented.');
  }
  update(interviewer: Interviewer): Promise<Interviewer> {
    throw new Error('Method not implemented.');
  }
  findOne(businessId: BusinessId): Promise<Interviewer> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<Interviewer[]> {
    const interviewerEntities = await this.repo.find();
    return interviewerEntities.map((interviewer) => toDomain(interviewer));
  }
}
