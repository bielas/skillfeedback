import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/infrastructure/database/base.entity';
import {
  TechnologyCategory,
  TechnologyName,
} from 'src/technology/core/domain/technology';

@Entity('technologies')
export class TechnologyEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: TechnologyName,
    unique: true,
  })
  name: TechnologyName;

  @Column({
    type: 'enum',
    enum: TechnologyCategory,
  })
  category: TechnologyCategory;

  @Column({ default: true })
  isActive: boolean;
}
