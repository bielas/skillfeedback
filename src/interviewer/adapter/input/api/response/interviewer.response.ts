import {
  Interviewer,
  InterviewerStatus,
} from 'src/interviewer/core/domain/interviewer';

export interface InterviewerResponse {
  businessId: string;
  firstName: string;
  lastName: string;
  status: InterviewerStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const toResponse = (interviewer: Interviewer): InterviewerResponse => ({
  businessId: interviewer.businessId.value,
  firstName: interviewer.firstName,
  lastName: interviewer.lastName,
  status: interviewer.status,
  createdAt: interviewer.createdAt,
  updatedAt: interviewer.updatedAt,
});
