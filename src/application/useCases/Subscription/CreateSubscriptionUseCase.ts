import { Subscription } from "@/application/entites/Subscription";
import { SubscriptionRepository } from "@/infra/database/dynamo/repositories/SubscriptionRepository";
import { Injectable } from "@/kernel/decorators/Injectable";
import { StripePlans } from "@/shared/types/StripePlans";

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute({
    accountId,
    priceId,
    stripeCustomerId,
    stripeSubscriptionId,
  }: CreateSubscriptionUseCase.Input): Promise<CreateSubscriptionUseCase.Output> {
    const plan = StripePlans[priceId as keyof typeof StripePlans];
    if (!plan) {
      throw new Error("Invalid Stripe Price");
    }
    const subscription = new Subscription({
      accountId,
      plan: {
        name: plan.name,
        price: plan.price,
        maxBarbershops: plan.maxBarbershops,
      },
      status: "ACTIVE",
      stripeCustomerId: stripeCustomerId,
      stripePriceId: priceId,
      stripeSubscriptionId: stripeSubscriptionId,
    });

    await this.subscriptionRepository.create(subscription);
  }
}

export namespace CreateSubscriptionUseCase {
  export type Input = {
    accountId: string;
    priceId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
  };

  export type Output = void;
}
