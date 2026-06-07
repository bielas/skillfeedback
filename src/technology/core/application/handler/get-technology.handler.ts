import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTechnologyQuery } from '../query/get-technology.query';
import { TechnologyRepository } from '../../domain/technology.repository';
import { Technology } from '../../domain/technology';
import { BusinessId } from 'src/shared/id/businessId';

@QueryHandler(GetTechnologyQuery)
export class GetTechnologyHandler implements IQueryHandler<GetTechnologyQuery> {
  constructor(
    @Inject(TechnologyRepository)
    private readonly repository: TechnologyRepository,
  ) {}

  execute(query: GetTechnologyQuery): Promise<Technology> {
    return this.repository.findOne(BusinessId.of(query.businessId));
  }
}
