import {
  Interviewer,
  InterviewerStatus,
} from 'src/interviewer/core/domain/interviewer';

class TechnologyInResponse {
  id: string;
  name: string;
  category: string;
}

export class InterviewerResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: InterviewerStatus;
  technologies: TechnologyInResponse[];
  createdAt: Date;
  updatedAt: Date;

  static from(interviewer: Interviewer): InterviewerResponse {
    const response = new InterviewerResponse();
    response.id = interviewer.businessId.value;
    response.firstName = interviewer.details.firstName;
    response.lastName = interviewer.details.lastName;
    response.email = interviewer.details.email;
    response.status = interviewer.status;
    response.technologies = interviewer.technologies.map((t) => ({
      id: t.businessId.value,
      name: t.name,
      category: t.category,
    }));
    response.createdAt = interviewer.createdAt;
    response.updatedAt = interviewer.updatedAt;
    return response;
  }
}
