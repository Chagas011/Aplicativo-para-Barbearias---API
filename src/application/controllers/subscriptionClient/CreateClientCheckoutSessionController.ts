import { Controller } from "@/application/contracts/Controller";

import { CreateClientCheckoutSessionUseCase } from "@/application/useCases/SubscriptionClient/CreateClientCheckoutSessionUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";
import {
  CreateClientCheckoutSessionBody,
  createClientCheckoutSessionSchema,
} from "./schema/createClientCheckoutSessionSchema";

@Injectable()
@Roles("client")
@Schema(createClientCheckoutSessionSchema)
export class CreateClientCheckoutSessionController extends Controller<
  "private",
  CreateClientCheckoutSessionController.Response
> {
  constructor(
    private readonly createClientCheckoutSessionUseCase: CreateClientCheckoutSessionUseCase,
  ) {
    super();
  }

  protected override async handle({
    body,
    accountId,
  }: Controller.Request<"private", CreateClientCheckoutSessionBody>): Promise<
    Controller.Response<CreateClientCheckoutSessionController.Response>
  > {
    const { planId, barbershopId } = body;
    const { checkoutUrl } =
      await this.createClientCheckoutSessionUseCase.execute({
        accountId,
        barbershopId,
        planId,
      });
    return {
      statusCode: 200,
      body: {
        checkoutUrl,
      },
    };
  }
}

export namespace CreateClientCheckoutSessionController {
  export type Response = {
    checkoutUrl: string;
  };
}
