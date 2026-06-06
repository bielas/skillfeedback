import {
  Interviewer,
  InterviewerDetails,
  InterviewerStatus,
} from './interviewer';
import { BusinessId } from 'src/shared/id/businessId';
import { Technology } from 'src/technology/core/domain/technology';

export interface InterviewerRepository {
  create(entity: Interviewer): Promise<Interviewer>;
  findOne(businessId: BusinessId): Promise<Interviewer>;
  findAll(): Promise<Interviewer[]>;
  updateDetails(
    businessId: BusinessId,
    details: InterviewerDetails,
  ): Promise<Interviewer>;
  updateTechnologies(
    businessId: BusinessId,
    technologies: Technology[],
  ): Promise<Interviewer>;
  updateStatus(
    businessId: BusinessId,
    status: InterviewerStatus,
  ): Promise<void>;
}

export const InterviewerRepository = Symbol('InterviewerRepository');
