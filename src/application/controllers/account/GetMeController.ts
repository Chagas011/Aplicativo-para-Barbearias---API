import { Controller } from "@/application/contracts/Controller";
import { Account } from "@/application/entites/Account";
import { GetMeUseCase } from "@/application/useCases/Account/GetMeUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetMeController extends Controller<
  "private",
  GetMeController.Response
> {
  constructor(private readonly getMeUseCase: GetMeUseCase) {
    super();
  }
  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<GetMeController.Response>
  > {
    const { account } = await this.getMeUseCase.execute({
      accountId,
    });

    return {
      statusCode: 200,
      body: {
        account,
      },
    };
  }
}

export namespace GetMeController {
  export type Response = {
    account: Account;
  };
}
