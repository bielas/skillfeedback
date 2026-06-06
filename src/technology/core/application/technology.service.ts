import { Inject, Injectable } from '@nestjs/common';
import { BusinessId } from 'src/shared/id/businessId';
import { TechnologyRepository } from 'src/technology/core/domain/technology.repository';
import {
  Technology,
  TechnologyCategory,
  TechnologyName,
} from 'src/technology/core/domain/technology';

@Injectable()
export class TechnologyService {
  constructor(
    @Inject(TechnologyRepository)
    private readonly repository: TechnologyRepository,
  ) {}

  async create(
    name: TechnologyName,
    category: TechnologyCategory,
  ): Promise<Technology> {
    const technology = new Technology(name, category);
    return this.repository.create(technology);
  }

  async findOne(businessId: BusinessId): Promise<Technology> {
    return this.repository.findOne(businessId);
  }

  async findAll(): Promise<Technology[]> {
    return this.repository.findAll();
  }

  async findByCategory(category: TechnologyCategory): Promise<Technology[]> {
    return this.repository.findByCategory(category);
  }

  async findByIds(ids: BusinessId[]): Promise<Technology[]> {
    return this.repository.findByIds(ids);
  }

  async deactivate(businessId: BusinessId): Promise<void> {
    const technology = await this.repository.findOne(businessId);
    technology.deactivate();
    await this.repository.update(technology);
  }

  async activate(businessId: BusinessId): Promise<void> {
    const technology = await this.repository.findOne(businessId);
    technology.activate();
    await this.repository.update(technology);
  }
}
