import { randomUUID } from 'crypto';
import { BusinessId } from 'src/shared/id/businessId';

export enum TechnologyCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DEVOPS = 'DEVOPS',
  DATABASE = 'DATABASE',
  MOBILE = 'MOBILE',
}

export enum TechnologyName {
  // Frontend
  REACT = 'REACT',
  ANGULAR = 'ANGULAR',
  VUE = 'VUE',
  TYPESCRIPT = 'TYPESCRIPT',
  JAVASCRIPT = 'JAVASCRIPT',
  // Backend
  JAVA = 'JAVA',
  KOTLIN = 'KOTLIN',
  NODE_JS = 'NODE_JS',
  PYTHON = 'PYTHON',
  GO = 'GO',
  DOTNET = 'DOTNET',
  // Mobile
  SWIFT = 'SWIFT',
  FLUTTER = 'FLUTTER',
  REACT_NATIVE = 'REACT_NATIVE',
  // Database
  POSTGRESQL = 'POSTGRESQL',
  MONGODB = 'MONGODB',
  REDIS = 'REDIS',
  // DevOps
  DOCKER = 'DOCKER',
  KUBERNETES = 'KUBERNETES',
  AWS = 'AWS',
}

export class Technology {
  businessId: BusinessId;
  name: TechnologyName;
  category: TechnologyCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(name: TechnologyName, category: TechnologyCategory) {
    this.businessId = BusinessId.of(randomUUID());
    this.name = name;
    this.category = category;
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  deactivate(): void {
    if (!this.isActive) {
      throw new Error('Technology is already inactive');
    }
    this.isActive = false;
  }

  activate(): void {
    if (this.isActive) {
      throw new Error('Technology is already active');
    }
    this.isActive = true;
  }
}
