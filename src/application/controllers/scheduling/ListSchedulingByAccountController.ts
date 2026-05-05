import { Controller } from "@/application/contracts/Controller";
import { Scheduling } from "@/application/entites/Scheduling";
import { ListSchedulingByAccountUseCase } from "@/application/useCases/scheduling/ListSchedulingByAccountUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListSchedulingByAccountController extends Controller<
  "private",
  ListSchedulingByAccountController.Response
> {
  constructor(
    private readonly listSchedulingByAccountUseCase: ListSchedulingByAccountUseCase,
  ) {
    super();
  }
  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<ListSchedulingByAccountController.Response>
  > {
    const { scheduling } = await this.listSchedulingByAccountUseCase.execute({
      accountId,
    });

    return {
      statusCode: 200,
      body: {
        scheduling,
      },
    };
  }
}

export namespace ListSchedulingByAccountController {
  export type Response = {
    scheduling: Scheduling[];
  };
}
