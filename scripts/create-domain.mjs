// scripts/create-domain.mjs
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('📝 Enter domain name: ', (domainName) => {
  rl.close();

  if (!domainName || domainName.trim() === '') {
    console.error('❌ Domain name cannot be empty');
    process.exit(1);
  }

  domainName = domainName.trim().toLowerCase();
  const pascal = domainName.charAt(0).toUpperCase() + domainName.slice(1);
  const root = `src/${domainName}`;

  const files = [
    // domain
    {
      path: `${root}/core/domain/${domainName}.ts`,
      content: `import { randomUUID } from 'crypto';
import { BusinessId } from 'src/shared/id/businessId';

export class ${pascal} {
  businessId: BusinessId;

  constructor() {
    this.businessId = BusinessId.of(randomUUID());
  }
}
`,
    },
    {
      path: `${root}/core/domain/${domainName}.repository.ts`,
      content: `import { ${pascal} } from './${domainName}';
import { BusinessId } from 'src/shared/id/businessId';

export interface ${pascal}Repository {
  create(entity: ${pascal}): Promise<${pascal}>;
  findOne(businessId: BusinessId): Promise<${pascal}>;
  findAll(): Promise<${pascal}[]>;
  update(entity: ${pascal}): Promise<${pascal}>;
  delete(businessId: BusinessId): Promise<void>;
}

export const ${pascal}Repository = Symbol('${pascal}Repository');
`,
    },

    // application
    {
      path: `${root}/core/application/${domainName}.service.ts`,
      content: `import { Inject, Injectable } from '@nestjs/common';
import { ${pascal} } from '../domain/${domainName}';
import { ${pascal}Repository } from '../domain/${domainName}.repository';
import { BusinessId } from 'src/shared/id/businessId';

@Injectable()
export class ${pascal}Service {
  constructor(
    @Inject(${pascal}Repository)
    private readonly repository: ${pascal}Repository,
  ) {}

  async create(): Promise<${pascal}> {
    const entity = new ${pascal}();
    return this.repository.create(entity);
  }

  async findOne(businessId: BusinessId): Promise<${pascal}> {
    return this.repository.findOne(businessId);
  }

  async findAll(): Promise<${pascal}[]> {
    return this.repository.findAll();
  }

  async delete(businessId: BusinessId): Promise<void> {
    await this.repository.delete(businessId);
  }
}
`,
    },

    // adapter — input
    {
      path: `${root}/adapter/input/api/request/create-${domainName}.request.ts`,
      content: `import { IsString } from 'class-validator';

export class Create${pascal}Request {
  @IsString()
  // add fields
}
`,
    },
    {
      path: `${root}/adapter/input/api/response/${domainName}.response.ts`,
      content: `export class ${pascal}Response {
  id: string;

  static from(entity: { businessId: { value: string } }): ${pascal}Response {
    const response = new ${pascal}Response();
    response.id = entity.businessId.value;
    return response;
  }
}
`,
    },
    {
      path: `${root}/adapter/input/api/${domainName}.controller.ts`,
      content: `import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ${pascal}Service } from '../../../core/application/${domainName}.service';
import { ${pascal}Response } from './response/${domainName}.response';
import { Create${pascal}Request } from './request/create-${domainName}.request';

@Controller('${domainName}s')
export class ${pascal}Controller {
  constructor(private readonly service: ${pascal}Service) {}

  @Post()
  async create(@Body() body: Create${pascal}Request): Promise<${pascal}Response> {
    const entity = await this.service.create();
    return ${pascal}Response.from(entity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<${pascal}Response> {
    const entity = await this.service.findOne(id as any);
    return ${pascal}Response.from(entity);
  }

  @Get()
  async findAll(): Promise<${pascal}Response[]> {
    const entities = await this.service.findAll();
    return entities.map((entity) => ${pascal}Response.from(entity));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(id as any);
  }
}
`,
    },

    // adapter — input — http
    {
      path: `${root}/adapter/input/api/${domainName}.http`,
      content: `### Create ${pascal}
POST http://localhost:3000/${domainName}s
Content-Type: application/json

{
}

### Get all ${pascal}s
GET http://localhost:3000/${domainName}s

### Get ${pascal} by id
GET http://localhost:3000/${domainName}s/your-id-here

### Delete ${pascal}
DELETE http://localhost:3000/${domainName}s/your-id-here
`,
    },

    // adapter — output
    {
      path: `${root}/adapter/output/db/${domainName}.entity.ts`,
      content: `import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('${domainName}s')
export class ${pascal}Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // add columns
}
`,
    },
    {
      path: `${root}/adapter/output/db/${domainName}.postgres.repository.ts`,
      content: `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${pascal}Repository } from '../../../core/domain/${domainName}.repository';
import { ${pascal} } from '../../../core/domain/${domainName}';
import { ${pascal}Entity } from './${domainName}.entity';
import { BusinessId } from 'src/shared/id/businessId';

@Injectable()
export class ${pascal}PostgresRepository implements ${pascal}Repository {
  constructor(
    @InjectRepository(${pascal}Entity)
    private readonly repo: Repository<${pascal}Entity>,
  ) {}

  async create(entity: ${pascal}): Promise<${pascal}> {
    throw new Error('Not implemented');
  }

  async findOne(businessId: BusinessId): Promise<${pascal}> {
    throw new Error('Not implemented');
  }

  async findAll(): Promise<${pascal}[]> {
    throw new Error('Not implemented');
  }

  async update(entity: ${pascal}): Promise<${pascal}> {
    throw new Error('Not implemented');
  }

  async delete(businessId: BusinessId): Promise<void> {
    throw new Error('Not implemented');
  }
}
`,
    },

    // module
    {
      path: `${root}/${domainName}.module.ts`,
      content: `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${pascal}Controller } from './adapter/input/api/${domainName}.controller';
import { ${pascal}Service } from './core/application/${domainName}.service';
import { ${pascal}PostgresRepository } from './adapter/output/db/${domainName}.postgres.repository';
import { ${pascal}Entity } from './adapter/output/db/${domainName}.entity';
import { ${pascal}Repository } from './core/domain/${domainName}.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([${pascal}Entity]),
  ],
  controllers: [${pascal}Controller],
  providers: [
    ${pascal}Service,
    {
      provide: ${pascal}Repository,
      useClass: ${pascal}PostgresRepository,
    },
  ],
  exports: [${pascal}Service],
})
export class ${pascal}Module {}
`,
    },
  ];

  // --- create files ---
  let created = 0;

  for (const file of files) {
    if (existsSync(file.path)) {
      console.log(`⏭️  skipping (exists): ${file.path}`);
      continue;
    }

    mkdirSync(join(file.path, '..'), { recursive: true });
    writeFileSync(file.path, file.content, 'utf-8');
    console.log(`✅ created: ${file.path}`);
    created++;
  }

  // --- add module to app.module.ts ---
  const appModulePath = 'src/app.module.ts';

  if (existsSync(appModulePath)) {
    let appModule = readFileSync(appModulePath, 'utf-8');

    const alreadyImported = appModule.includes(`${pascal}Module`);

    if (!alreadyImported) {
      const importLine = `import { ${pascal}Module } from './${domainName}/${domainName}.module';\n`;

      // add import at the top
      appModule = importLine + appModule;

      // add to imports array
      appModule = appModule.replace(
        /imports:\s*\[/,
        `imports: [\n    ${pascal}Module,`,
      );

      writeFileSync(appModulePath, appModule, 'utf-8');
      console.log(`✅ added ${pascal}Module to app.module.ts`);
    } else {
      console.log(`⏭️  ${pascal}Module already in app.module.ts`);
    }
  } else {
    console.warn(`⚠️  app.module.ts not found — add ${pascal}Module manually`);
  }

  console.log(`\n🎉 Done! Created ${created} files for domain "${domainName}"`);
});
