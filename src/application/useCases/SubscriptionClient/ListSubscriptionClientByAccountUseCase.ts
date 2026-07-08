import { SubscriptionClient } from "@/application/entites/SubscriptionClient";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { SubscriptionClientRepository } from "@/infra/database/dynamo/repositories/SubscriptionClientRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListSubscriptionClientByAccountUseCase {
  constructor(
    private readonly subscriptionClientRepository: SubscriptionClientRepository,
  ) {}

  async execute({
    accountId,
  }: ListSubscriptionClientByAccountUseCase.Input): Promise<ListSubscriptionClientByAccountUseCase.Output> {
    const subscriptionClient =
      await this.subscriptionClientRepository.listByAccount(accountId);

    if (!subscriptionClient) {
      throw new ResouceNotFound();
    }
    return { subscriptionClient };
  }
}

export namespace ListSubscriptionClientByAccountUseCase {
  export type Output = {
    subscriptionClient: SubscriptionClient[];
  };

  export type Input = {
    accountId: string;
  };
}
