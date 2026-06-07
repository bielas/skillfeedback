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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InterviewerResponse } from './response/interviewer.response';
import { InterviewerRequest } from './request/interviewer.request';
import { UpdateInterviewerRequest } from './request/update-interviewer.request';
import { CreateInterviewerCommand } from '../../../core/application/command/create-interviewer.command';
import { UpdateInterviewerDetailsCommand } from '../../../core/application/command/update-interviewer-details.command';
import { AddTechnologyToInterviewerCommand } from '../../../core/application/command/add-technology-to-interviewer.command';
import { RemoveTechnologyFromInterviewerCommand } from '../../../core/application/command/remove-technology-from-interviewer.command';
import { ActivateInterviewerCommand } from '../../../core/application/command/activate-interviewer.command';
import { DeactivateInterviewerCommand } from '../../../core/application/command/deactivate-interviewer.command';
import { GetAllInterviewersQuery } from '../../../core/application/query/get-all-interviewers.query';
import { GetInterviewerQuery } from '../../../core/application/query/get-interviewer.query';
import { Interviewer } from '../../../core/domain/interviewer';

@ApiTags('Interviewer')
@Controller({ path: 'interviewers', version: ['1'] })
export class InterviewerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new interviewer' })
  async create(@Body() body: InterviewerRequest): Promise<InterviewerResponse> {
    const interviewer = await this.commandBus.execute<
      CreateInterviewerCommand,
      Interviewer
    >(
      new CreateInterviewerCommand(
        {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
        },
        body.technologyIds,
      ),
    );
    return InterviewerResponse.from(interviewer);
  }

  @Get()
  @ApiOperation({ summary: 'Get all interviewers' })
  async findAll(): Promise<InterviewerResponse[]> {
    const interviewers = await this.queryBus.execute<
      GetAllInterviewersQuery,
      Interviewer[]
    >(new GetAllInterviewersQuery());
    return interviewers.map((i) => InterviewerResponse.from(i));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get interviewer by id' })
  async findOne(@Param('id') id: string): Promise<InterviewerResponse> {
    const interviewer = await this.queryBus.execute<
      GetInterviewerQuery,
      Interviewer
    >(new GetInterviewerQuery(id));
    return InterviewerResponse.from(interviewer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update interviewer details' })
  async updateDetails(
    @Param('id') id: string,
    @Body() body: UpdateInterviewerRequest,
  ): Promise<InterviewerResponse> {
    const interviewer = await this.commandBus.execute<
      UpdateInterviewerDetailsCommand,
      Interviewer
    >(new UpdateInterviewerDetailsCommand(id, body));
    return InterviewerResponse.from(interviewer);
  }

  @Post(':id/technologies/:technologyId')
  @ApiOperation({ summary: 'Add technology to interviewer' })
  async addTechnology(
    @Param('id') id: string,
    @Param('technologyId') technologyId: string,
  ): Promise<InterviewerResponse> {
    const interviewer = await this.commandBus.execute<
      AddTechnologyToInterviewerCommand,
      Interviewer
    >(new AddTechnologyToInterviewerCommand(id, technologyId));
    return InterviewerResponse.from(interviewer);
  }

  @Delete(':id/technologies/:technologyId')
  @ApiOperation({ summary: 'Remove technology from interviewer' })
  async removeTechnology(
    @Param('id') id: string,
    @Param('technologyId') technologyId: string,
  ): Promise<InterviewerResponse> {
    const interviewer = await this.commandBus.execute<
      RemoveTechnologyFromInterviewerCommand,
      Interviewer
    >(new RemoveTechnologyFromInterviewerCommand(id, technologyId));
    return InterviewerResponse.from(interviewer);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate interviewer' })
  async deactivate(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeactivateInterviewerCommand(id));
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate interviewer' })
  async activate(@Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new ActivateInterviewerCommand(id));
  }
}
