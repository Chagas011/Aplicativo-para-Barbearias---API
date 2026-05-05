import { Controller } from "@/application/contracts/Controller";
import { DeleteServiceUseCase } from "@/application/useCases/Service/DeleteServiceUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";

@Injectable()
@Roles("admin")
export class DeleteServiceController extends Controller<
  "private",
  DeleteServiceController.Response
> {
  constructor(private readonly deleteServiceUseCase: DeleteServiceUseCase) {
    super();
  }
  protected override async handle({
    params,
    accountId,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    DeleteServiceController.Params
  >): Promise<Controller.Response<DeleteServiceController.Response>> {
    await this.deleteServiceUseCase.execute({
      accountId,
      serviceId: params.serviceId,
      barberId: params.barberId,
    });

    return {
      statusCode: 204,
    };
  }
}

export namespace DeleteServiceController {
  export type Response = void;

  export type Params = {
    serviceId: string;
    barberId: string;
  };
}
