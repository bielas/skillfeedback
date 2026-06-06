import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BusinessId } from 'src/shared/id/businessId';
import { InterviewerEntity } from './interviewer.entity';
import { Technology } from 'src/technology/core/domain/technology';
import { TechnologyEntity } from 'src/technology/adapter/output/db/technology.entity';
import {
  Interviewer,
  InterviewerDetails,
  InterviewerStatus,
} from 'src/interviewer/core/domain/interviewer';
import { InterviewerRepository } from 'src/interviewer/core/domain/interviewer.repository';

const toDomain = (entity: InterviewerEntity): Interviewer => {
  const technologies = entity.technologies.map((t) => {
    const technology = new Technology(t.name, t.category);
    technology.businessId = BusinessId.of(t.businessId);
    technology.isActive = t.isActive;
    technology.createdAt = t.createdAt;
    technology.updatedAt = t.updatedAt;
    return technology;
  });

  const interviewer = new Interviewer(
    {
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
    },
    technologies,
  );

  interviewer.businessId = BusinessId.of(entity.businessId);
  interviewer.status = entity.status;
  interviewer.createdAt = entity.createdAt;
  interviewer.updatedAt = entity.updatedAt;

  return interviewer;
};

const toEntity = (interviewer: Interviewer): InterviewerEntity => {
  const entity = new InterviewerEntity();
  entity.firstName = interviewer.details.firstName;
  entity.lastName = interviewer.details.lastName;
  entity.email = interviewer.details.email;
  entity.status = interviewer.status;
  return entity;
};

@Injectable()
export class InterviewerPostgresRepository implements InterviewerRepository {
  constructor(
    @InjectRepository(InterviewerEntity)
    private readonly repo: Repository<InterviewerEntity>,
    @InjectRepository(TechnologyEntity)
    private readonly technologyRepo: Repository<TechnologyEntity>,
  ) {}

  async create(interviewer: Interviewer): Promise<Interviewer> {
    const entity = toEntity(interviewer);

    entity.technologies = await this.technologyRepo.find({
      where: {
        businessId: In(interviewer.technologies.map((t) => t.businessId.value)),
      },
    });

    const saved = await this.repo.save(entity);
    return toDomain(saved);
  }

  async findOne(businessId: BusinessId): Promise<Interviewer> {
    const entity = await this.repo.findOneOrFail({
      where: { businessId: businessId.value },
      relations: { technologies: true },
    });
    return toDomain(entity);
  }

  async findAll(): Promise<Interviewer[]> {
    const entities = await this.repo.find({
      relations: { technologies: true },
    });
    return entities.map((entity) => toDomain(entity));
  }

  async updateDetails(
    businessId: BusinessId,
    details: InterviewerDetails,
  ): Promise<Interviewer> {
    await this.repo.update(
      { businessId: businessId.value },
      {
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
      },
    );
    return this.findOne(businessId);
  }

  async updateTechnologies(
    businessId: BusinessId,
    technologies: Technology[],
  ): Promise<Interviewer> {
    const entity = await this.repo.findOneOrFail({
      where: { businessId: businessId.value },
      relations: { technologies: true },
    });

    entity.technologies = await this.technologyRepo.find({
      where: {
        businessId: In(technologies.map((t) => t.businessId.value)),
      },
    });

    const saved = await this.repo.save(entity);
    return toDomain(saved);
  }

  async updateStatus(
    businessId: BusinessId,
    status: InterviewerStatus,
  ): Promise<void> {
    await this.repo.update({ businessId: businessId.value }, { status });
  }
}
