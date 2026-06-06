import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTechnologyRequest } from 'src/technology/adapter/input/api/request/create-technology.request';
import { TechnologyResponse } from 'src/technology/adapter/input/api/response/technology.response';
import { TechnologyService } from 'src/technology/core/application/technology.service';
import { BusinessId } from 'src/shared/id/businessId';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Technology')
@Controller({ path: 'technologies', version: ['1'] })
export class TechnologyController {
  constructor(private readonly service: TechnologyService) {}

  @Post()
  async create(
    @Body() body: CreateTechnologyRequest,
  ): Promise<TechnologyResponse> {
    const technology = await this.service.create(body.name, body.category);
    return TechnologyResponse.from(technology);
  }

  @Get()
  async findAll(): Promise<TechnologyResponse[]> {
    const technologies = await this.service.findAll();
    return technologies.map((t) => TechnologyResponse.from(t));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TechnologyResponse> {
    const technology = await this.service.findOne(BusinessId.of(id));
    return TechnologyResponse.from(technology);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<void> {
    await this.service.deactivate(BusinessId.of(id));
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string): Promise<void> {
    await this.service.activate(BusinessId.of(id));
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.deactivate(BusinessId.of(id)); // soft delete przez deactivate
  }
}
