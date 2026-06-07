import { TechnologyCategory, TechnologyName } from '../../domain/technology';

export class CreateTechnologyCommand {
  constructor(
    readonly name: TechnologyName,
    readonly category: TechnologyCategory,
  ) {}
}
