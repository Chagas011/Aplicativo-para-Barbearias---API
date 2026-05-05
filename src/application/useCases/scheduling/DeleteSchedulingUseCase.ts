import { SchedulingRepository } from "@/infra/database/dynamo/repositories/SchedulingRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class DeleteSchedulingUseCase {
  constructor(private readonly schedulingRepository: SchedulingRepository) {}

  async execute({
    accountId,
    barberId,
    date,
    startTime,
  }: DeleteSchedulingUseCase.Input): Promise<DeleteSchedulingUseCase.Output> {
    const now = new Date();
    const schedulingDate = new Date(`${date}T${startTime}:00`);

    if (schedulingDate < now) {
      throw new Error("Cannot delete past scheduling");
    }
    await this.schedulingRepository.delete(
      accountId,
      barberId,
      date,
      startTime,
    );
  }
}

export namespace DeleteSchedulingUseCase {
  export type Input = {
    accountId: string;
    barberId: string;
    date: string;
    startTime: string;
  };

  export type Output = void;
}
