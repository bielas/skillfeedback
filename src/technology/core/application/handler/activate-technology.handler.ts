import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ActivateTechnologyCommand } from '../command/activate-technology.command';
import { TechnologyRepository } from '../../domain/technology.repository';
import { BusinessId } from 'src/shared/id/businessId';

@CommandHandler(ActivateTechnologyCommand)
export class ActivateTechnologyHandler implements ICommandHandler<ActivateTechnologyCommand> {
  constructor(
    @Inject(TechnologyRepository)
    private readonly repository: TechnologyRepository,
  ) {}

  async execute(command: ActivateTechnologyCommand): Promise<void> {
    const technology = await this.repository.findOne(
      BusinessId.of(command.businessId),
    );
    technology.activate();
    await this.repository.update(technology);
  }
}
