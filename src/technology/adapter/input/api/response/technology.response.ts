import {
  Technology,
  TechnologyCategory,
  TechnologyName,
} from 'src/technology/core/domain/technology';

export class TechnologyResponse {
  id: string;
  name: TechnologyName;
  category: TechnologyCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  static from(technology: Technology): TechnologyResponse {
    const response = new TechnologyResponse();
    response.id = technology.businessId.value;
    response.name = technology.name;
    response.category = technology.category;
    response.isActive = technology.isActive;
    response.createdAt = technology.createdAt;
    response.updatedAt = technology.updatedAt;
    return response;
  }
}
