import { Subscription } from "@/application/entites/Subscription";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { SubscriptionRepository } from "@/infra/database/dynamo/repositories/SubscriptionRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListSubscriptionByAccountUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute({
    accountId,
  }: ListSubscriptionByAccountUseCase.Input): Promise<ListSubscriptionByAccountUseCase.Output> {
    const subscription =
      await this.subscriptionRepository.listByAccount(accountId);

    if (!subscription) {
      throw new ResouceNotFound();
    }
    return { subscription };
  }
}

export namespace ListSubscriptionByAccountUseCase {
  export type Output = {
    subscription: Subscription[];
  };

  export type Input = {
    accountId: string;
  };
}
