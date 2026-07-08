import { Plan } from "@/application/entites/Plan";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { AccountRepository } from "@/infra/database/dynamo/repositories/AccountRepository";
import { PlanRepository } from "@/infra/database/dynamo/repositories/PlanRepository";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/Appconfig";
import Stripe from "stripe";
@Injectable()
export class CreatePlanUseCase {
  private readonly stripe;
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly accountRepository: AccountRepository,
    private readonly appConfig: AppConfig,
  ) {
    this.stripe = new Stripe(this.appConfig.stripe.stripeSecretKey);
  }

  async execute({
    barbershopId,
    accountId,
    name,
    price,
    remaningServices,
    services,
  }: CreatePlanUseCase.Input): Promise<CreatePlanUseCase.Output> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new ResouceNotFound();
    }

    if (!account.stripeConnectAccountId) {
      throw new Error("Conta Stripe Connect não vinculada.");
    }
    // criar product na conta connect
    const productStripe = await this.stripe.products.create(
      {
        name,
        description: `${remaningServices} utilizações por mês`,
      },
      {
        stripeAccount: account.stripeConnectAccountId,
      },
    );

    const priceStripe = await this.stripe.prices.create(
      {
        product: productStripe.id,
        unit_amount: Math.round(price * 100),
        currency: "brl",
        recurring: {
          interval: "month",
        },
      },
      {
        stripeAccount: account.stripeConnectAccountId,
      },
    );
    const plan = new Plan({
      accountId,
      barbershopId,
      name,
      price,
      remaningServices,
      services,
      stripePriceId: priceStripe.id,
      stripeProductId: productStripe.id,
    });
    await this.planRepository.create(plan);
    return {
      plan,
    };
  }
}

export namespace CreatePlanUseCase {
  export type Input = {
    barbershopId: string;
    accountId: string;
    name: string;
    price: number;
    remaningServices: number;
    services: string[];
  };

  export type Output = {
    plan: Plan;
  };
}
