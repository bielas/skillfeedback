import { Inject, Injectable } from '@nestjs/common';
import { InterviewerRepository } from '../domain/interviewer.repository';
import { Interviewer, InterviewerDetails } from '../domain/interviewer';
import { BusinessId } from 'src/shared/id/businessId';
import { TechnologyService } from 'src/technology/core/application/technology.service';

@Injectable()
export class InterviewerService {
  constructor(
    @Inject(InterviewerRepository)
    private readonly interviewerRepository: InterviewerRepository,
    private readonly technologyService: TechnologyService,
  ) {}

  async create(
    details: InterviewerDetails,
    technologyIds: string[],
  ): Promise<Interviewer> {
    const technologies = await this.technologyService.findByIds(
      technologyIds.map((id) => BusinessId.of(id)),
    );
    return this.interviewerRepository.create(
      new Interviewer(details, technologies),
    );
  }

  async findAll(): Promise<Interviewer[]> {
    const interviewers = await this.interviewerRepository.findAll();
    return interviewers.filter((interviewer) => interviewer.isActive());
  }

  async findOne(businessId: BusinessId): Promise<Interviewer> {
    return this.interviewerRepository.findOne(businessId);
  }

  async updateDetails(
    businessId: BusinessId,
    details: InterviewerDetails,
  ): Promise<Interviewer> {
    const interviewer = await this.interviewerRepository.findOne(businessId);
    interviewer.updateDetails(details);
    return this.interviewerRepository.updateDetails(
      businessId,
      interviewer.details,
    );
  }

  async addTechnology(
    businessId: BusinessId,
    technologyId: string,
  ): Promise<Interviewer> {
    const interviewer = await this.interviewerRepository.findOne(businessId);
    const technology = await this.technologyService.findOne(
      BusinessId.of(technologyId),
    );
    interviewer.addTechnology(technology);
    return this.interviewerRepository.updateTechnologies(
      businessId,
      interviewer.technologies,
    );
  }

  async removeTechnology(
    businessId: BusinessId,
    technologyId: string,
  ): Promise<Interviewer> {
    const interviewer = await this.interviewerRepository.findOne(businessId);
    interviewer.removeTechnology(BusinessId.of(technologyId));
    return this.interviewerRepository.updateTechnologies(
      businessId,
      interviewer.technologies,
    );
  }

  async deactivate(businessId: BusinessId): Promise<void> {
    const interviewer = await this.interviewerRepository.findOne(businessId);
    interviewer.makeInActive();
    await this.interviewerRepository.updateStatus(
      businessId,
      interviewer.status,
    );
  }

  async activate(businessId: BusinessId): Promise<void> {
    const interviewer = await this.interviewerRepository.findOne(businessId);
    interviewer.makeActive();
    await this.interviewerRepository.updateStatus(
      businessId,
      interviewer.status,
    );
  }
}
