import { InterviewerDetails } from '../../domain/interviewer';

export class CreateInterviewerCommand {
  constructor(
    readonly details: InterviewerDetails,
    readonly technologyIds: string[],
  ) {}
}
