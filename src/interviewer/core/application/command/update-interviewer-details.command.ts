import { InterviewerDetails } from '../../domain/interviewer';

export class UpdateInterviewerDetailsCommand {
  constructor(
    readonly businessId: string,
    readonly details: Partial<InterviewerDetails>,
  ) {}
}
