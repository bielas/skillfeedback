import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeactivateTechnologyCommand } from '../command/deactivate-technology.command';
import { TechnologyRepository } from '../../domain/technology.repository';
import { BusinessId } from 'src/shared/id/businessId';

@CommandHandler(DeactivateTechnologyCommand)
export class DeactivateTechnologyHandler implements ICommandHandler<DeactivateTechnologyCommand> {
  constructor(
    @Inject(TechnologyRepository)
    private readonly repository: TechnologyRepository,
  ) {}

  async execute(command: DeactivateTechnologyCommand): Promise<void> {
    const technology = await this.repository.findOne(
      BusinessId.of(command.businessId),
    );
    technology.deactivate();
    await this.repository.update(technology);
  }
}
