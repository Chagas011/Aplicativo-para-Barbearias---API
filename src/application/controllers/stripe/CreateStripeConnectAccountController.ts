import { Controller } from "@/application/contracts/Controller";
import { CreateStripeConnectAccountUseCase } from "@/application/useCases/Stripe/CreateStripeConnectAccountUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";

@Injectable()
@Roles("admin")
export class CreateStripeConnectAccountController extends Controller<
  "private",
  CreateStripeConnectAccountController.Response
> {
  constructor(
    private readonly createStripeConnectAccountUseCase: CreateStripeConnectAccountUseCase,
  ) {
    super();
  }

  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<CreateStripeConnectAccountController.Response>
  > {
    const { accountLink } =
      await this.createStripeConnectAccountUseCase.execute({
        accountId,
      });
    return {
      statusCode: 201,
      body: {
        accountLink,
      },
    };
  }
}

export namespace CreateStripeConnectAccountController {
  export type Response = {
    accountLink: string;
  };
}
