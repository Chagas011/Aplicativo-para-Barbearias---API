import { Plan } from "@/application/entites/Plan";
import { PlanRepository } from "@/infra/database/dynamo/repositories/PlanRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListPlanByBarbershopUseCase {
  constructor(private readonly planRepository: PlanRepository) {}

  async execute({
    barbershopId,
  }: ListPlanByBarbershopUseCase.Input): Promise<ListPlanByBarbershopUseCase.Output> {
    const plans = await this.planRepository.listByBarbershop(barbershopId);
    return {
      plans,
    };
  }
}

export namespace ListPlanByBarbershopUseCase {
  export type Input = {
    barbershopId: string;
  };

  export type Output = {
    plans: Plan[];
  };
}
