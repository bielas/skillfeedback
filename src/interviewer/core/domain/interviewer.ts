import { randomUUID } from 'crypto';
import { BusinessId } from 'src/shared/id/businessId';
import { Technology } from 'src/technology/core/domain/technology';
import { TechnologyAlreadyAssignedError } from 'src/interviewer/core/domain/error/technology-already-assigned.error';

export enum InterviewerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface InterviewerDetails {
  firstName: string;
  lastName: string;
  email: string;
}

export class Interviewer {
  businessId: BusinessId;
  details: InterviewerDetails;
  technologies: Technology[];
  status: InterviewerStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(details: InterviewerDetails, technologies: Technology[]) {
    this.businessId = BusinessId.of(randomUUID());
    this.details = { ...details };
    this.technologies = technologies;
    this.status = InterviewerStatus.ACTIVE;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status === InterviewerStatus.ACTIVE;
  }

  makeInActive(): void {
    this.status = InterviewerStatus.INACTIVE;
  }

  makeActive(): void {
    this.status = InterviewerStatus.ACTIVE;
  }

  updateDetails(details: Partial<InterviewerDetails>): void {
    this.details = {
      ...this.details,
      ...details,
    };
  }

  addTechnology(technology: Technology): void {
    if (this.hasTechnology(technology.businessId)) {
      throw new TechnologyAlreadyAssignedError(technology.businessId.value);
    }
    this.technologies.push(technology);
  }

  removeTechnology(technologyId: BusinessId): void {
    this.technologies = this.technologies.filter(
      (t) => t.businessId.value !== technologyId.value,
    );
  }

  canInterview(technologyId: BusinessId): boolean {
    return this.hasTechnology(technologyId);
  }

  private hasTechnology(technologyId: BusinessId): boolean {
    return this.technologies.some(
      (t) => t.businessId.value === technologyId.value,
    );
  }
}
