import { randomUUID } from 'crypto';
import { BusinessId } from 'src/shared/id/businessId';

export enum InterviewerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class Interviewer {
  businessId: BusinessId;
  firstName: string;
  lastName: string;
  status: InterviewerStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(firstName: string, lastName: string) {
    this.businessId = BusinessId.of(randomUUID());
    this.firstName = firstName;
    this.lastName = lastName;
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
}
