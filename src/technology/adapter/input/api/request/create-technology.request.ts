import { IsEnum } from 'class-validator';
import {
  TechnologyCategory,
  TechnologyName,
} from 'src/technology/core/domain/technology';

export class CreateTechnologyRequest {
  @IsEnum(TechnologyName)
  name: TechnologyName;

  @IsEnum(TechnologyCategory)
  category: TechnologyCategory;
}
