import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TechnologyEntity } from 'src/technology/adapter/output/db/technology.entity';
import {
  Technology,
  TechnologyCategory,
} from 'src/technology/core/domain/technology';
import { TechnologyRepository } from 'src/technology/core/domain/technology.repository';
import { BusinessId } from 'src/shared/id/businessId';

const toDomain = (entity: TechnologyEntity): Technology => {
  const technology = new Technology(entity.name, entity.category);
  technology.businessId = BusinessId.of(entity.businessId);
  technology.isActive = entity.isActive;
  technology.createdAt = entity.createdAt;
  technology.updatedAt = entity.updatedAt;
  return technology;
};

const toEntity = (domain: Technology): TechnologyEntity => {
  const entity = new TechnologyEntity();
  entity.name = domain.name;
  entity.category = domain.category;
  entity.isActive = domain.isActive;
  return entity;
};

@Injectable()
export class TechnologyPostgresRepository implements TechnologyRepository {
  constructor(
    @InjectRepository(TechnologyEntity)
    private readonly repo: Repository<TechnologyEntity>,
  ) {}

  async create(domain: Technology): Promise<Technology> {
    const entity = toEntity(domain);
    const saved = await this.repo.save(entity);
    return toDomain(saved);
  }

  async findOne(businessId: BusinessId): Promise<Technology> {
    const entity = await this.repo.findOneOrFail({
      where: { businessId: businessId.value },
    });
    return toDomain(entity);
  }

  async findAll(): Promise<Technology[]> {
    const entities = await this.repo.find();
    return entities.map((entity) => toDomain(entity));
  }

  async findByCategory(category: TechnologyCategory): Promise<Technology[]> {
    const entities = await this.repo.find({ where: { category } });
    return entities.map((entity) => toDomain(entity));
  }

  async findByIds(ids: BusinessId[]): Promise<Technology[]> {
    const entities = await this.repo.find({
      where: { businessId: In(ids.map((id) => id.value)) },
    });
    return entities.map((entity) => toDomain(entity));
  }

  async update(domain: Technology): Promise<Technology> {
    const entity = await this.repo.findOneOrFail({
      where: { businessId: domain.businessId.value },
    });
    entity.isActive = domain.isActive;
    const saved = await this.repo.save(entity);
    return toDomain(saved);
  }

  async delete(businessId: BusinessId): Promise<void> {
    await this.repo.delete({ businessId: businessId.value });
  }
}
