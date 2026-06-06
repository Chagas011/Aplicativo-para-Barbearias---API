import { Controller } from "@/application/contracts/Controller";

import { CreateSubscriptionUseCase } from "@/application/useCases/Subscription/CreateSubscriptionUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";
import {
  CreateSubscriptionBody,
  createSubscriptionSchema,
} from "./schema/createSubscriptionSchema";

@Injectable()
@Roles("admin")
@Schema(createSubscriptionSchema)
export class CreateSubscriptionController extends Controller<
  "private",
  CreateBarbershopController.Response
> {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
  ) {
    super();
  }

  protected override async handle({
    body,
    accountId,
  }: Controller.Request<"private", CreateSubscriptionBody>): Promise<
    Controller.Response<CreateBarbershopController.Response>
  > {
    const { planName } = body;
    await this.createSubscriptionUseCase.execute({
      accountId,
      planName,
    });

    return {
      statusCode: 200,
    };
  }
}

export namespace CreateBarbershopController {
  export type Response = void;
}
