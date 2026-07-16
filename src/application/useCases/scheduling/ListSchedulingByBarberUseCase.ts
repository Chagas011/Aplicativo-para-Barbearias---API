import { Scheduling } from "@/application/entites/Scheduling";
import { SchedulingRepository } from "@/infra/database/dynamo/repositories/SchedulingRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListSchedulingByBarberUseCase {
  constructor(private readonly schedulingRepository: SchedulingRepository) {}

  async execute({
    barberId,
    date,
  }: ListSchedulingByBarberUseCase.Input): Promise<ListSchedulingByBarberUseCase.Output> {
    const scheduling = await this.schedulingRepository.listByBarberAndDate(
      barberId,
      date,
    );

    return {
      scheduling,
    };
  }
}

export namespace ListSchedulingByBarberUseCase {
  export type Input = {
    barberId: string;
    date?: string;
  };

  export type Output = {
    scheduling: Scheduling[];
  };
}
