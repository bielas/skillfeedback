import { Interviewer } from 'src/interviewer/core/domain/interviewer';

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class InterviewerRequest {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;
}

export const toDomain = (request: InterviewerRequest): Interviewer => {
  const interviewer = new Interviewer(request.firstName, request.lastName);
  interviewer.createdAt = new Date();
  interviewer.updatedAt = new Date();
  return interviewer;
};
