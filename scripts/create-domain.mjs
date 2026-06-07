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

    // application — commands
    {
      path: `${root}/core/application/command/create-${domainName}.command.ts`,
      content: `export class Create${pascal}Command {}
`,
    },

    // application — queries
    {
      path: `${root}/core/application/query/get-all-${domainName}s.query.ts`,
      content: `export class GetAll${pascal}sQuery {}
`,
    },
    {
      path: `${root}/core/application/query/get-${domainName}.query.ts`,
      content: `export class Get${pascal}Query {
  constructor(readonly businessId: string) {}
}
`,
    },

    // application — command handlers
    {
      path: `${root}/core/application/handler/create-${domainName}.handler.ts`,
      content: `import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Create${pascal}Command } from '../command/create-${domainName}.command';
import { ${pascal}Repository } from '../../domain/${domainName}.repository';
import { ${pascal} } from '../../domain/${domainName}';

@CommandHandler(Create${pascal}Command)
export class Create${pascal}Handler
  implements ICommandHandler<Create${pascal}Command>
{
  constructor(
    @Inject(${pascal}Repository)
    private readonly repository: ${pascal}Repository,
  ) {}

  execute(): Promise<${pascal}> {
    const entity = new ${pascal}();
    return this.repository.create(entity);
  }
}
`,
    },

    // application — query handlers
    {
      path: `${root}/core/application/handler/get-all-${domainName}s.handler.ts`,
      content: `import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAll${pascal}sQuery } from '../query/get-all-${domainName}s.query';
import { ${pascal}Repository } from '../../domain/${domainName}.repository';
import { ${pascal} } from '../../domain/${domainName}';

@QueryHandler(GetAll${pascal}sQuery)
export class GetAll${pascal}sHandler
  implements IQueryHandler<GetAll${pascal}sQuery>
{
  constructor(
    @Inject(${pascal}Repository)
    private readonly repository: ${pascal}Repository,
  ) {}

  execute(): Promise<${pascal}[]> {
    return this.repository.findAll();
  }
}
`,
    },
    {
      path: `${root}/core/application/handler/get-${domainName}.handler.ts`,
      content: `import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Get${pascal}Query } from '../query/get-${domainName}.query';
import { ${pascal}Repository } from '../../domain/${domainName}.repository';
import { ${pascal} } from '../../domain/${domainName}';
import { BusinessId } from 'src/shared/id/businessId';

@QueryHandler(Get${pascal}Query)
export class Get${pascal}Handler implements IQueryHandler<Get${pascal}Query> {
  constructor(
    @Inject(${pascal}Repository)
    private readonly repository: ${pascal}Repository,
  ) {}

  execute(query: Get${pascal}Query): Promise<${pascal}> {
    return this.repository.findOne(BusinessId.of(query.businessId));
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
      content: `import { ${pascal} } from '../../../../core/domain/${domainName}';

export class ${pascal}Response {
  id: string;

  static from(entity: ${pascal}): ${pascal}Response {
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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ${pascal}Response } from './response/${domainName}.response';
import { Create${pascal}Request } from './request/create-${domainName}.request';
import { Create${pascal}Command } from '../../../core/application/command/create-${domainName}.command';
import { GetAll${pascal}sQuery } from '../../../core/application/query/get-all-${domainName}s.query';
import { Get${pascal}Query } from '../../../core/application/query/get-${domainName}.query';
import { ${pascal} } from '../../../core/domain/${domainName}';

@ApiTags('${pascal}')
@Controller({ path: '${domainName}s', version: ['1'] })
export class ${pascal}Controller {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ${domainName}' })
  async create(@Body() body: Create${pascal}Request): Promise<${pascal}Response> {
    const entity = await this.commandBus.execute<Create${pascal}Command, ${pascal}>(
      new Create${pascal}Command(),
    );
    return ${pascal}Response.from(entity);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ${domainName}s' })
  async findAll(): Promise<${pascal}Response[]> {
    const entities = await this.queryBus.execute<GetAll${pascal}sQuery, ${pascal}[]>(
      new GetAll${pascal}sQuery(),
    );
    return entities.map((entity) => ${pascal}Response.from(entity));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ${domainName} by id' })
  async findOne(@Param('id') id: string): Promise<${pascal}Response> {
    const entity = await this.queryBus.execute<Get${pascal}Query, ${pascal}>(
      new Get${pascal}Query(id),
    );
    return ${pascal}Response.from(entity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ${domainName}' })
  async delete(@Param('id') id: string): Promise<void> {
    // TODO: add DeleteCommand
  }
}
`,
    },

    // adapter — input — http
    {
      path: `${root}/adapter/input/api/${domainName}.http`,
      content: `### Create ${pascal}
POST http://localhost:3000/api/v1/${domainName}s
Content-Type: application/json

{
}

### Get all ${pascal}s
GET http://localhost:3000/api/v1/${domainName}s

### Get ${pascal} by id
GET http://localhost:3000/api/v1/${domainName}s/your-id-here

### Delete ${pascal}
DELETE http://localhost:3000/api/v1/${domainName}s/your-id-here
`,
    },

    // adapter — output
    {
      path: `${root}/adapter/output/db/${domainName}.entity.ts`,
      content: `import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/infrastructure/database/base.entity';

@Entity('${domainName}s')
export class ${pascal}Entity extends BaseEntity {
  // add columns
}

export const toDomain = (entity: ${pascal}Entity): any => {
  throw new Error('Not implemented');
};

export const toEntity = (domain: any): ${pascal}Entity => {
  const entity = new ${pascal}Entity();
  // map fields
  return entity;
};
`,
    },
    {
      path: `${root}/adapter/output/db/${domainName}.postgres.repository.ts`,
      content: `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${pascal}Repository } from '../../../core/domain/${domainName}.repository';
import { ${pascal} } from '../../../core/domain/${domainName}';
import { ${pascal}Entity, toDomain, toEntity } from './${domainName}.entity';
import { BusinessId } from 'src/shared/id/businessId';

@Injectable()
export class ${pascal}PostgresRepository implements ${pascal}Repository {
  constructor(
    @InjectRepository(${pascal}Entity)
    private readonly repo: Repository<${pascal}Entity>,
  ) {}

  async create(domain: ${pascal}): Promise<${pascal}> {
    const entity = toEntity(domain);
    const saved = await this.repo.save(entity);
    return toDomain(saved);
  }

  async findOne(businessId: BusinessId): Promise<${pascal}> {
    const entity = await this.repo.findOneOrFail({
      where: { businessId: businessId.value },
    });
    return toDomain(entity);
  }

  async findAll(): Promise<${pascal}[]> {
    const entities = await this.repo.find();
    return entities.map((entity) => toDomain(entity));
  }

  async update(domain: ${pascal}): Promise<${pascal}> {
    throw new Error('Not implemented');
  }

  async delete(businessId: BusinessId): Promise<void> {
    await this.repo.delete({ businessId: businessId.value });
  }
}
`,
    },

    // module
    {
      path: `${root}/${domainName}.module.ts`,
      content: `import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${pascal}Controller } from './adapter/input/api/${domainName}.controller';
import { ${pascal}PostgresRepository } from './adapter/output/db/${domainName}.postgres.repository';
import { ${pascal}Entity } from './adapter/output/db/${domainName}.entity';
import { ${pascal}Repository } from './core/domain/${domainName}.repository';
import { Create${pascal}Handler } from './core/application/handler/create-${domainName}.handler';
import { GetAll${pascal}sHandler } from './core/application/handler/get-all-${domainName}s.handler';
import { Get${pascal}Handler } from './core/application/handler/get-${domainName}.handler';

const CommandHandlers = [Create${pascal}Handler];

const QueryHandlers = [GetAll${pascal}sHandler, Get${pascal}Handler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([${pascal}Entity])],
  controllers: [${pascal}Controller],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: ${pascal}Repository,
      useClass: ${pascal}PostgresRepository,
    },
  ],
  exports: [CqrsModule],
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

      appModule = importLine + appModule;

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
