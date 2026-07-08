import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { AccountRepository } from "@/infra/database/dynamo/repositories/AccountRepository";
import { PlanRepository } from "@/infra/database/dynamo/repositories/PlanRepository";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/Appconfig";
import Stripe from "stripe";

@Injectable()
export class CreateClientCheckoutSessionUseCase {
  private readonly stripe;
  constructor(
    private readonly appConfig: AppConfig,
    private readonly planRepository: PlanRepository,
    private readonly accountRepository: AccountRepository,
  ) {
    this.stripe = new Stripe(this.appConfig.stripe.stripeSecretKey);
  }
  async execute({
    accountId,
    planId,
    barbershopId,
  }: CreateClientCheckoutSessionUseCase.Input): Promise<CreateClientCheckoutSessionUseCase.Output> {
    const plan = await this.planRepository.findById(barbershopId, planId);

    if (!plan) {
      throw new ResouceNotFound();
    }

    const barbershopAdminAccount = await this.accountRepository.findById(
      plan.accountId,
    );

    if (!barbershopAdminAccount) {
      throw new ResouceNotFound();
    }
    if (!barbershopAdminAccount.stripeConnectAccountId) {
      throw new Error("Barbearia não configurou recebimentos.");
    }
    if (!plan.stripePriceId) {
      throw new Error("Plano não sincronizado com Stripe.");
    }
    const session = await this.stripe.checkout.sessions.create(
      {
        mode: "subscription",

        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        success_url:
          "https://d1kedj493fgm56.cloudfront.net/subscription?success=true",

        cancel_url: "https://d1kedj493fgm56.cloudfront.net/",

        metadata: {
          clientAccountId: accountId,
          barbershopAdminAccountId: barbershopAdminAccount.id,
          barbershopId: plan.barbershopId,
          planId: plan.id,
          planName: plan.name,
        },
      },
      {
        stripeAccount: barbershopAdminAccount.stripeConnectAccountId,
      },
    );

    return {
      checkoutUrl: session.url!,
    };
  }
}

export namespace CreateClientCheckoutSessionUseCase {
  export type Input = {
    accountId: string;
    planId: string;
    barbershopId: string;
  };

  export type Output = {
    checkoutUrl: string;
  };
}
