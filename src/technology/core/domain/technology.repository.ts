import { Technology, TechnologyCategory } from './technology';
import { BusinessId } from 'src/shared/id/businessId';

export interface TechnologyRepository {
  create(technology: Technology): Promise<Technology>;
  findOne(businessId: BusinessId): Promise<Technology>;
  findAll(): Promise<Technology[]>;
  findByCategory(category: TechnologyCategory): Promise<Technology[]>;
  findByIds(ids: BusinessId[]): Promise<Technology[]>;
  update(technology: Technology): Promise<Technology>;
  delete(businessId: BusinessId): Promise<void>;
}

export const TechnologyRepository = Symbol('TechnologyRepository');
