import { Body, Controller, Get, Post } from '@nestjs/common';
import { InterviewerService } from 'src/interviewer/core/domain/interviewer.service';
import {
  InterviewerResponse,
  toResponse,
} from 'src/interviewer/adapter/input/api/response/interviewer.response';
import { InterviewerRequest } from 'src/interviewer/adapter/input/api/request/interviewer.request';

@Controller({ path: 'interviewers', version: ['1'] })
export class InterviewerController {
  constructor(private readonly interviewerService: InterviewerService) {}

  @Post()
  async create(
    @Body() interviewerRequest: InterviewerRequest,
  ): Promise<InterviewerResponse> {
    const newInterviewer = await this.interviewerService.create(
      interviewerRequest.firstName,
      interviewerRequest.lastName,
    );
    return toResponse(newInterviewer);
  }

  @Get()
  async findAll(): Promise<InterviewerResponse[]> {
    const interviewers = await this.interviewerService.findAll();
    return interviewers.map((interviewer) => toResponse(interviewer));
  }
}
