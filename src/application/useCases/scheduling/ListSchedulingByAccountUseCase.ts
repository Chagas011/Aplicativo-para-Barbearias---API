import { Scheduling } from "@/application/entites/Scheduling";
import { SchedulingRepository } from "@/infra/database/dynamo/repositories/SchedulingRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListSchedulingByAccountUseCase {
  constructor(private readonly schedulingRepository: SchedulingRepository) {}

  async execute({
    accountId,
  }: ListSchedulingByAccountUseCase.Input): Promise<ListSchedulingByAccountUseCase.Output> {
    const scheduling = await this.schedulingRepository.listByClient(accountId);

    return {
      scheduling,
    };
  }
}

export namespace ListSchedulingByAccountUseCase {
  export type Input = {
    accountId: string;
  };

  export type Output = {
    scheduling: Scheduling[];
  };
}
