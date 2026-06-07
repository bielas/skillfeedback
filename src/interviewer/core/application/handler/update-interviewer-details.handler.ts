import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateInterviewerDetailsCommand } from '../command/update-interviewer-details.command';
import { InterviewerRepository } from '../../domain/interviewer.repository';
import { Interviewer } from '../../domain/interviewer';
import { BusinessId } from 'src/shared/id/businessId';

@CommandHandler(UpdateInterviewerDetailsCommand)
export class UpdateInterviewerDetailsHandler implements ICommandHandler<UpdateInterviewerDetailsCommand> {
  constructor(
    @Inject(InterviewerRepository)
    private readonly repository: InterviewerRepository,
  ) {}

  async execute(
    command: UpdateInterviewerDetailsCommand,
  ): Promise<Interviewer> {
    const businessId = BusinessId.of(command.businessId);
    const interviewer = await this.repository.findOne(businessId);
    interviewer.updateDetails(command.details);
    return this.repository.updateDetails(businessId, interviewer.details);
  }
}
