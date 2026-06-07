import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateInterviewerCommand } from '../command/create-interviewer.command';
import { InterviewerRepository } from '../../domain/interviewer.repository';
import { Interviewer } from '../../domain/interviewer';
import { TechnologyRepository } from 'src/technology/core/domain/technology.repository';
import { BusinessId } from 'src/shared/id/businessId';

@CommandHandler(CreateInterviewerCommand)
export class CreateInterviewerHandler implements ICommandHandler<CreateInterviewerCommand> {
  constructor(
    @Inject(InterviewerRepository)
    private readonly repository: InterviewerRepository,
    @Inject(TechnologyRepository)
    private readonly technologyRepository: TechnologyRepository,
  ) {}

  async execute(command: CreateInterviewerCommand): Promise<Interviewer> {
    const technologies = await this.technologyRepository.findByIds(
      command.technologyIds.map((id) => BusinessId.of(id)),
    );
    return this.repository.create(
      new Interviewer(command.details, technologies),
    );
  }
}
