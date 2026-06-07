export class AddTechnologyToInterviewerCommand {
  constructor(
    readonly businessId: string,
    readonly technologyId: string,
  ) {}
}
