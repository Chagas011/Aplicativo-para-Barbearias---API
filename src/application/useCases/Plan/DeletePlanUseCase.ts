import { PlanRepository } from "@/infra/database/dynamo/repositories/PlanRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class DeletePlanUseCase {
  constructor(private readonly planRepository: PlanRepository) {}

  async execute({
    barbershopId,
    planId,
  }: DeletePlanUseCase.Input): Promise<DeletePlanUseCase.Output> {
    await this.planRepository.delete(barbershopId, planId);
  }
}

export namespace DeletePlanUseCase {
  export type Input = {
    barbershopId: string;
    planId: string;
  };

  export type Output = void;
}
