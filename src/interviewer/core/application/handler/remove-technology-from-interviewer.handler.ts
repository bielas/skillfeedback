import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RemoveTechnologyFromInterviewerCommand } from '../command/remove-technology-from-interviewer.command';
import { InterviewerRepository } from '../../domain/interviewer.repository';
import { Interviewer } from '../../domain/interviewer';
import { BusinessId } from 'src/shared/id/businessId';

@CommandHandler(RemoveTechnologyFromInterviewerCommand)
export class RemoveTechnologyFromInterviewerHandler implements ICommandHandler<RemoveTechnologyFromInterviewerCommand> {
  constructor(
    @Inject(InterviewerRepository)
    private readonly repository: InterviewerRepository,
  ) {}

  async execute(
    command: RemoveTechnologyFromInterviewerCommand,
  ): Promise<Interviewer> {
    const businessId = BusinessId.of(command.businessId);
    const interviewer = await this.repository.findOne(businessId);
    interviewer.removeTechnology(BusinessId.of(command.technologyId));
    return this.repository.updateTechnologies(
      businessId,
      interviewer.technologies,
    );
  }
}
