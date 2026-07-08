import { SubscriptionClient } from "@/application/entites/SubscriptionClient";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { AccountRepository } from "@/infra/database/dynamo/repositories/AccountRepository";
import { PlanRepository } from "@/infra/database/dynamo/repositories/PlanRepository";
import { SubscriptionClientRepository } from "@/infra/database/dynamo/repositories/SubscriptionClientRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class CreateSubscriptionClientUseCase {
  constructor(
    private readonly subscriptionClientRepository: SubscriptionClientRepository,
    private readonly planRepository: PlanRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async execute({
    planId,
    barbershopId,
    clientAccountId,
    stripeCustomerId,
    stripeSubscriptionId,
  }: CreateSubscriptionClientUseCase.Input): Promise<CreateSubscriptionClientUseCase.Output> {
    const plan = await this.planRepository.findById(barbershopId, planId);
    if (!plan) {
      throw new ResouceNotFound();
    }

    const barbershopAdminAccount = await this.accountRepository.findById(
      plan.accountId,
    );
    const subscriptionClient = new SubscriptionClient({
      accountId: clientAccountId,
      barbershopId,
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        remaningServices: plan.remaningServices,
      },
      status: "ACTIVE",
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId: plan.stripePriceId!,
      stripeConnectAccountId: barbershopAdminAccount!.stripeConnectAccountId!,
    });

    await this.subscriptionClientRepository.create(subscriptionClient);
  }
}

export namespace CreateSubscriptionClientUseCase {
  export type Input = {
    planId: string;
    barbershopId: string;
    clientAccountId: string;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
  };

  export type Output = void;
}
