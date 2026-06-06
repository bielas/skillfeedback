import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/infrastructure/database/base.entity';
import { InterviewerStatus } from 'src/interviewer/core/domain/interviewer';
import { TechnologyEntity } from 'src/technology/adapter/output/db/technology.entity';

@Entity('interviewers')
export class InterviewerEntity extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: InterviewerStatus,
    default: InterviewerStatus.ACTIVE,
  })
  status: InterviewerStatus;

  @ManyToMany(() => TechnologyEntity, { cascade: true })
  @JoinTable({
    name: 'interviewer_technologies',
    joinColumn: { name: 'interviewer_id' },
    inverseJoinColumn: { name: 'technology_id' },
  })
  technologies: TechnologyEntity[];
}
