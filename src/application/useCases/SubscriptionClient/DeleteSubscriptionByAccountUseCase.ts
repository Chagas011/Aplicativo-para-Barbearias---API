import { SubscriptionRepository } from "@/infra/database/dynamo/repositories/SubscriptionRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class DeleteSubscriptionByAccountUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute({
    accountId,
    subscriptionId,
  }: DeleteSubscriptionByAccountUseCase.Input): Promise<DeleteSubscriptionByAccountUseCase.Output> {
    await this.subscriptionRepository.delete(accountId, subscriptionId);
  }
}

export namespace DeleteSubscriptionByAccountUseCase {
  export type Output = void;

  export type Input = {
    accountId: string;
    subscriptionId: string;
  };
}
