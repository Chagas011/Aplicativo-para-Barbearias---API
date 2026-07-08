import { Subscription } from "@/application/entites/Subscription";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { SubscriptionRepository } from "@/infra/database/dynamo/repositories/SubscriptionRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetSubscriptionByAccountUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute({
    accountId,
    subscriptionId,
  }: GetSubscriptionByAccountUseCase.Input): Promise<GetSubscriptionByAccountUseCase.Output> {
    const subscription = await this.subscriptionRepository.findById(
      accountId,
      subscriptionId,
    );

    if (!subscription) {
      throw new ResouceNotFound();
    }
    return { subscription };
  }
}

export namespace GetSubscriptionByAccountUseCase {
  export type Output = {
    subscription: Subscription;
  };

  export type Input = {
    accountId: string;
    subscriptionId: string;
  };
}
