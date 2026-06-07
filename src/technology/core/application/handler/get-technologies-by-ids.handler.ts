import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTechnologiesByIdsQuery } from '../query/get-technologies-by-ids.query';
import { TechnologyRepository } from '../../domain/technology.repository';
import { Technology } from '../../domain/technology';
import { BusinessId } from 'src/shared/id/businessId';

@QueryHandler(GetTechnologiesByIdsQuery)
export class GetTechnologiesByIdsHandler implements IQueryHandler<GetTechnologiesByIdsQuery> {
  constructor(
    @Inject(TechnologyRepository)
    private readonly repository: TechnologyRepository,
  ) {}

  execute(query: GetTechnologiesByIdsQuery): Promise<Technology[]> {
    return this.repository.findByIds(query.ids.map((id) => BusinessId.of(id)));
  }
}
