import { Plan } from "@/application/entites/Plan";
import { PlanRepository } from "@/infra/database/dynamo/repositories/PlanRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class CreatePlanUseCase {
  constructor(private readonly planRepository: PlanRepository) {}

  async execute({
    barbershopId,
    name,
    price,
    remaningServices,
    services,
  }: CreatePlanUseCase.Input): Promise<CreatePlanUseCase.Output> {
    const plan = new Plan({
      barbershopId,
      name,
      price,
      remaningServices,
      services,
    });

    return {
      plan,
    };
  }
}

export namespace CreatePlanUseCase {
  export type Input = {
    barbershopId: string;
    name: string;
    price: number;
    remaningServices: number;
    services: string[];
  };

  export type Output = {
    plan: Plan;
  };
}
