export class RemoveTechnologyFromInterviewerCommand {
  constructor(
    readonly businessId: string,
    readonly technologyId: string,
  ) {}
}
