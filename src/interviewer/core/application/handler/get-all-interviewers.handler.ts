import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllInterviewersQuery } from '../query/get-all-interviewers.query';
import { InterviewerRepository } from '../../domain/interviewer.repository';
import { Interviewer } from '../../domain/interviewer';

@QueryHandler(GetAllInterviewersQuery)
export class GetAllInterviewersHandler implements IQueryHandler<GetAllInterviewersQuery> {
  constructor(
    @Inject(InterviewerRepository)
    private readonly repository: InterviewerRepository,
  ) {}

  async execute(): Promise<Interviewer[]> {
    const interviewers = await this.repository.findAll();
    return interviewers.filter((i) => i.isActive());
  }
}
