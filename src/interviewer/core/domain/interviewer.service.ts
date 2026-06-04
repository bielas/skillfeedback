import { Inject, Injectable } from '@nestjs/common';
import { InterviewerRepository } from 'src/interviewer/core/domain/interviewer.repository';
import { Interviewer } from 'src/interviewer/core/domain/interviewer';
import { BusinessId } from 'src/shared/id/businessId';

@Injectable()
export class InterviewerService {
  constructor(
    @Inject(InterviewerRepository)
    private readonly interviewerRepository: InterviewerRepository,
  ) {}

  async create(firstName: string, lastName: string): Promise<Interviewer> {
    const interviewer = new Interviewer(firstName, lastName);
    return this.interviewerRepository.create(interviewer);
  }

  async findAll(): Promise<Interviewer[]> {
    const interviewers = await this.interviewerRepository.findAll();
    return interviewers.filter((interviewer) => interviewer.isActive());
  }

  async findOne(businessId: BusinessId): Promise<Interviewer> {
    return this.interviewerRepository.findOne(businessId);
  }

  async delete(businessId: BusinessId): Promise<void> {
    const interviewer = await this.interviewerRepository.findOne(businessId);
    interviewer.makeInActive();
    await this.interviewerRepository.update(interviewer);
  }
}
