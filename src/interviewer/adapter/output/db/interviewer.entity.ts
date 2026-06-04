import { Interviewer } from 'src/interviewer/core/domain/interviewer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InterviewerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}

export const toDomain = (entity: InterviewerEntity): Interviewer => {
  const interviewer = new Interviewer(entity.firstName, entity.lastName);
  interviewer.createdAt = new Date();
  interviewer.updatedAt = new Date();
  return interviewer;
};

export const toEntity = (interviewer: Interviewer): InterviewerEntity => {
  const entity = new InterviewerEntity();
  // entity.businessId = interviewer.businessId.value;
  entity.firstName = interviewer.firstName;
  entity.lastName = interviewer.lastName;
  // entity.status = interviewer.status;
  // entity.createdAt = interviewer.createdAt;
  // entity.updatedAt = interviewer.updatedAt;
  return entity;
};
