import { DomainError } from 'src/shared/error/domain.error';

export class TechnologyAlreadyAssignedError extends DomainError {
  constructor(technologyId: string) {
    super(`Technology ${technologyId} is already assigned to this interviewer`);
    this.name = 'TechnologyAlreadyAssignedError';
  }
}
