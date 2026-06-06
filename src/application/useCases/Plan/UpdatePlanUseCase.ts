import { Plan } from "@/application/entites/Plan";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { PlanRepository } from "@/infra/database/dynamo/repositories/PlanRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class UpdatePlanUseCase {
  constructor(private readonly planRepository: PlanRepository) {}

  async execute({
    barbershopId,
    planId,
    name,
    price,
    remaningServices,
    services,
  }: UpdatePlanUseCase.Input): Promise<UpdatePlanUseCase.Output> {
    const plan = await this.planRepository.findById(barbershopId, planId);
    if (!plan) {
      throw new ResouceNotFound();
    }

    plan.name = name ?? plan.name;
    plan.price = price ?? plan.price;
    plan.remaningServices = remaningServices ?? plan.remaningServices;
    plan.services = services ?? plan.services;

    await this.planRepository.save(plan);
    return {
      plan,
    };
  }
}

export namespace UpdatePlanUseCase {
  export type Input = {
    planId: string;
    barbershopId: string;
    name?: string;
    price?: number;
    remaningServices?: number;
    services?: string[];
  };

  export type Output = {
    plan: Plan;
  };
}
