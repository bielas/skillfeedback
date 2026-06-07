import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllTechnologiesQuery } from '../query/get-all-technologies.query';
import { TechnologyRepository } from '../../domain/technology.repository';
import { Technology } from '../../domain/technology';

@QueryHandler(GetAllTechnologiesQuery)
export class GetAllTechnologiesHandler implements IQueryHandler<GetAllTechnologiesQuery> {
  constructor(
    @Inject(TechnologyRepository)
    private readonly repository: TechnologyRepository,
  ) {}

  execute(): Promise<Technology[]> {
    return this.repository.findAll();
  }
}
