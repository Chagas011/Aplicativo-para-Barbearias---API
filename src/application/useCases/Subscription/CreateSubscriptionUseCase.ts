import { Subscription } from "@/application/entites/Subscription";
import { SubscriptionRepository } from "@/infra/database/dynamo/repositories/SubscriptionRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute({
    accountId,
    planName,
  }: CreateSubscriptionUseCase.Input): Promise<CreateSubscriptionUseCase.Output> {
    if (planName === "BASIC") {
      const subscrption = new Subscription({
        accountId,
        plan: {
          name: "BASIC",
          price: 60,
          maxBarbershops: 2,
        },
        status: "ACTIVE",
      });

      await this.subscriptionRepository.create(subscrption);
    } else if (planName === "PREMIUM") {
      const subscrption = new Subscription({
        accountId,
        plan: {
          name: "PREMIUM",
          price: 140,
          maxBarbershops: 5,
        },
        status: "ACTIVE",
      });

      await this.subscriptionRepository.create(subscrption);
    } else {
      throw new Error("Invalid Plan");
    }
  }
}

export namespace CreateSubscriptionUseCase {
  export type Input = {
    accountId: string;
    planName: string;
  };

  export type Output = void;
}
