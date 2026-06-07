import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTechnologyRequest } from 'src/technology/adapter/input/api/request/create-technology.request';
import { TechnologyResponse } from 'src/technology/adapter/input/api/response/technology.response';
import { ApiTags } from '@nestjs/swagger';
import { CreateTechnologyCommand } from '../../../core/application/command/create-technology.command';
import { ActivateTechnologyCommand } from '../../../core/application/command/activate-technology.command';
import { DeactivateTechnologyCommand } from '../../../core/application/command/deactivate-technology.command';
import { GetAllTechnologiesQuery } from '../../../core/application/query/get-all-technologies.query';
import { GetTechnologyQuery } from '../../../core/application/query/get-technology.query';
import { Technology } from '../../../core/domain/technology';

@ApiTags('Technology')
@Controller({ path: 'technologies', version: ['1'] })
export class TechnologyController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Body() body: CreateTechnologyRequest,
  ): Promise<TechnologyResponse> {
    const technology = await this.commandBus.execute<
      CreateTechnologyCommand,
      Technology
    >(new CreateTechnologyCommand(body.name, body.category));
    return TechnologyResponse.from(technology);
  }

  @Get()
  async findAll(): Promise<TechnologyResponse[]> {
    const technologies = await this.queryBus.execute<
      GetAllTechnologiesQuery,
      Technology[]
    >(new GetAllTechnologiesQuery());
    return technologies.map((t) => TechnologyResponse.from(t));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TechnologyResponse> {
    const technology = await this.queryBus.execute<
      GetTechnologyQuery,
      Technology
    >(new GetTechnologyQuery(id));
    return TechnologyResponse.from(technology);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeactivateTechnologyCommand(id));
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new ActivateTechnologyCommand(id));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeactivateTechnologyCommand(id));
  }
}
