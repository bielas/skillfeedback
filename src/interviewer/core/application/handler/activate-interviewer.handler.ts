import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ActivateInterviewerCommand } from '../command/activate-interviewer.command';
import { InterviewerRepository } from '../../domain/interviewer.repository';
import { BusinessId } from 'src/shared/id/businessId';

@CommandHandler(ActivateInterviewerCommand)
export class ActivateInterviewerHandler implements ICommandHandler<ActivateInterviewerCommand> {
  constructor(
    @Inject(InterviewerRepository)
    private readonly repository: InterviewerRepository,
  ) {}

  async execute(command: ActivateInterviewerCommand): Promise<void> {
    const businessId = BusinessId.of(command.businessId);
    const interviewer = await this.repository.findOne(businessId);
    interviewer.makeActive();
    await this.repository.updateStatus(businessId, interviewer.status);
  }
}
