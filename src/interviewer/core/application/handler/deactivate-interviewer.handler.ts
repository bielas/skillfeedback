import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeactivateInterviewerCommand } from '../command/deactivate-interviewer.command';
import { InterviewerRepository } from '../../domain/interviewer.repository';
import { BusinessId } from 'src/shared/id/businessId';

@CommandHandler(DeactivateInterviewerCommand)
export class DeactivateInterviewerHandler implements ICommandHandler<DeactivateInterviewerCommand> {
  constructor(
    @Inject(InterviewerRepository)
    private readonly repository: InterviewerRepository,
  ) {}

  async execute(command: DeactivateInterviewerCommand): Promise<void> {
    const businessId = BusinessId.of(command.businessId);
    const interviewer = await this.repository.findOne(businessId);
    interviewer.makeInActive();
    await this.repository.updateStatus(businessId, interviewer.status);
  }
}
