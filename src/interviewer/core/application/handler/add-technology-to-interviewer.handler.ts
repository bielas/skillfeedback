import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AddTechnologyToInterviewerCommand } from '../command/add-technology-to-interviewer.command';
import { InterviewerRepository } from '../../domain/interviewer.repository';
import { Interviewer } from '../../domain/interviewer';
import { BusinessId } from 'src/shared/id/businessId';
import { TechnologyRepository } from 'src/technology/core/domain/technology.repository';

@CommandHandler(AddTechnologyToInterviewerCommand)
export class AddTechnologyToInterviewerHandler implements ICommandHandler<AddTechnologyToInterviewerCommand> {
  constructor(
    @Inject(InterviewerRepository)
    private readonly repository: InterviewerRepository,
    @Inject(TechnologyRepository)
    private readonly technologyRepository: TechnologyRepository,
  ) {}

  async execute(
    command: AddTechnologyToInterviewerCommand,
  ): Promise<Interviewer> {
    const businessId = BusinessId.of(command.businessId);
    const [interviewer, technology] = await Promise.all([
      this.repository.findOne(businessId),
      this.technologyRepository.findOne(BusinessId.of(command.technologyId)),
    ]);
    interviewer.addTechnology(technology);
    return this.repository.updateTechnologies(
      businessId,
      interviewer.technologies,
    );
  }
}
