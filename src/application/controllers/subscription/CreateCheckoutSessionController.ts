import { Controller } from "@/application/contracts/Controller";

import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";

import { CreateCheckoutSessionUseCase } from "@/application/useCases/Subscription/CreateCheckoutSessionUseCase";
import {
  CreateCheckoutSessionBody,
  createCheckoutSessionSchema,
} from "./schema/createCheckoutSessionSchema";

@Injectable()
@Roles("admin")
@Schema(createCheckoutSessionSchema)
export class CreateCheckoutSessionController extends Controller<
  "private",
  CreateCheckoutSessionController.Response
> {
  constructor(
    private readonly createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
  ) {
    super();
  }

  protected override async handle({
    body,
    accountId,
  }: Controller.Request<"private", CreateCheckoutSessionBody>): Promise<
    Controller.Response<CreateCheckoutSessionController.Response>
  > {
    const { planName } = body;
    const { checkoutUrl } = await this.createCheckoutSessionUseCase.execute({
      accountId,
      planName,
    });
    return {
      statusCode: 200,
      body: {
        checkoutUrl,
      },
    };
  }
}

export namespace CreateCheckoutSessionController {
  export type Response = {
    checkoutUrl: string;
  };
}
