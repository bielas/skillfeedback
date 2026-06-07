import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetInterviewerQuery } from '../query/get-interviewer.query';
import { InterviewerRepository } from '../../domain/interviewer.repository';
import { Interviewer } from '../../domain/interviewer';
import { BusinessId } from 'src/shared/id/businessId';

@QueryHandler(GetInterviewerQuery)
export class GetInterviewerHandler implements IQueryHandler<GetInterviewerQuery> {
  constructor(
    @Inject(InterviewerRepository)
    private readonly repository: InterviewerRepository,
  ) {}

  execute(query: GetInterviewerQuery): Promise<Interviewer> {
    return this.repository.findOne(BusinessId.of(query.businessId));
  }
}
