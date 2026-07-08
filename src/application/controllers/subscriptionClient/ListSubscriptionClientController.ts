import { Controller } from "@/application/contracts/Controller";

import { SubscriptionClient } from "@/application/entites/SubscriptionClient";
import { ListSubscriptionClientByAccountUseCase } from "@/application/useCases/SubscriptionClient/ListSubscriptionClientByAccountUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";

@Injectable()
@Roles("client")
export class ListSubscriptionClientController extends Controller<
  "private",
  ListSubscriptionClientController.Response
> {
  constructor(
    private readonly listSubscriptionClientByAccountUseCase: ListSubscriptionClientByAccountUseCase,
  ) {
    super();
  }

  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<ListSubscriptionClientController.Response>
  > {
    const { subscriptionClient } =
      await this.listSubscriptionClientByAccountUseCase.execute({
        accountId,
      });

    return {
      statusCode: 200,
      body: {
        subscriptionClient,
      },
    };
  }
}

export namespace ListSubscriptionClientController {
  export type Response = {
    subscriptionClient: SubscriptionClient[];
  };
}
