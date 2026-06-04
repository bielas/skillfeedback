import { Interviewer } from 'src/interviewer/core/domain/interviewer';
import { BusinessId } from 'src/shared/id/businessId';

export interface InterviewerRepository {
  create(interviewer: Interviewer): Promise<Interviewer>;
  delete(businessId: BusinessId): Promise<void>;
  update(interviewer: Interviewer): Promise<Interviewer>;
  findOne(businessId: BusinessId): Promise<Interviewer>;
  findAll(): Promise<Interviewer[]>;
}

export const InterviewerRepository = Symbol('InterviewerRepository');
