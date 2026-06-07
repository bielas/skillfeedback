import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateTechnologyCommand } from '../command/create-technology.command';
import { TechnologyRepository } from '../../domain/technology.repository';
import { Technology } from '../../domain/technology';

@CommandHandler(CreateTechnologyCommand)
export class CreateTechnologyHandler implements ICommandHandler<CreateTechnologyCommand> {
  constructor(
    @Inject(TechnologyRepository)
    private readonly repository: TechnologyRepository,
  ) {}

  execute(command: CreateTechnologyCommand): Promise<Technology> {
    const technology = new Technology(command.name, command.category);
    return this.repository.create(technology);
  }
}
