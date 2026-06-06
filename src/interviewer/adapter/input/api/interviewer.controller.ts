import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InterviewerResponse } from './response/interviewer.response';
import { InterviewerRequest } from './request/interviewer.request';
import { UpdateInterviewerRequest } from './request/update-interviewer.request';
import { BusinessId } from 'src/shared/id/businessId';
import { InterviewerService } from '../../../core/application/interviewer.service';

@ApiTags('Interviewer')
@Controller({ path: 'interviewers', version: ['1'] })
export class InterviewerController {
  constructor(private readonly service: InterviewerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new interviewer' })
  async create(@Body() body: InterviewerRequest): Promise<InterviewerResponse> {
    const interviewer = await this.service.create(
      { firstName: body.firstName, lastName: body.lastName, email: body.email },
      body.technologyIds,
    );
    return InterviewerResponse.from(interviewer);
  }

  @Get()
  @ApiOperation({ summary: 'Get all interviewers' })
  async findAll(): Promise<InterviewerResponse[]> {
    const interviewers = await this.service.findAll();
    return interviewers.map((i) => InterviewerResponse.from(i));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get interviewer by id' })
  async findOne(@Param('id') id: string): Promise<InterviewerResponse> {
    const interviewer = await this.service.findOne(BusinessId.of(id));
    return InterviewerResponse.from(interviewer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update interviewer details' })
  async updateDetails(
    @Param('id') id: string,
    @Body() body: UpdateInterviewerRequest,
  ): Promise<InterviewerResponse> {
    const interviewer = await this.service.updateDetails(
      BusinessId.of(id),
      body,
    );
    return InterviewerResponse.from(interviewer);
  }

  @Post(':id/technologies/:technologyId')
  @ApiOperation({ summary: 'Add technology to interviewer' })
  async addTechnology(
    @Param('id') id: string,
    @Param('technologyId') technologyId: string,
  ): Promise<InterviewerResponse> {
    const interviewer = await this.service.addTechnology(
      BusinessId.of(id),
      technologyId,
    );
    return InterviewerResponse.from(interviewer);
  }

  @Delete(':id/technologies/:technologyId')
  @ApiOperation({ summary: 'Remove technology from interviewer' })
  async removeTechnology(
    @Param('id') id: string,
    @Param('technologyId') technologyId: string,
  ): Promise<InterviewerResponse> {
    const interviewer = await this.service.removeTechnology(
      BusinessId.of(id),
      technologyId,
    );
    return InterviewerResponse.from(interviewer);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate interviewer' })
  async deactivate(@Param('id') id: string): Promise<void> {
    await this.service.deactivate(BusinessId.of(id));
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate interviewer' })
  async activate(@Param('id') id: string): Promise<void> {
    await this.service.activate(BusinessId.of(id));
  }
}
