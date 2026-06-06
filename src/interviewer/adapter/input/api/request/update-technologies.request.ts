import { IsArray, IsUUID } from 'class-validator';

export class UpdateTechnologiesRequest {
  @IsArray()
  @IsUUID('4', { each: true })
  technologyIds: string[];
}
