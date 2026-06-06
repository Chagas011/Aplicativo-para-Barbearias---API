import { Controller } from "@/application/contracts/Controller";

import { Subscription } from "@/application/entites/Subscription";
import { ListSubscriptionByAccountUseCase } from "@/application/useCases/Subscription/ListSubscriptionByAccountUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";
import { createSubscriptionSchema } from "./schema/createSubscriptionSchema";

@Injectable()
@Roles("admin")
@Schema(createSubscriptionSchema)
export class ListSubscriptionController extends Controller<
  "private",
  ListSubscriptionController.Response
> {
  constructor(
    private readonly listSubscriptionByAccountUseCase: ListSubscriptionByAccountUseCase,
  ) {
    super();
  }

  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<ListSubscriptionController.Response>
  > {
    const { subscription } =
      await this.listSubscriptionByAccountUseCase.execute({
        accountId,
      });

    return {
      statusCode: 200,
      body: {
        subscription,
      },
    };
  }
}

export namespace ListSubscriptionController {
  export type Response = {
    subscription: Subscription[];
  };
}
