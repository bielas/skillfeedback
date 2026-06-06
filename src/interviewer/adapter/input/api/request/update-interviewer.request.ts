import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateInterviewerRequest {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  email: string;
}
