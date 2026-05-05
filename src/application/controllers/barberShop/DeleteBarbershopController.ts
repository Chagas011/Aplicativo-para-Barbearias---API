import { Controller } from "@/application/contracts/Controller";
import { DeleteBarbershopUseCase } from "@/application/useCases/Barbershop/DeleteBarbershopUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";

@Injectable()
@Roles("admin")
export class DeleteBarbershopController extends Controller<
  "private",
  DeleteBarbershopController.Response
> {
  constructor(
    private readonly deleteBarbershopUseCase: DeleteBarbershopUseCase,
  ) {
    super();
  }
  protected override async handle({
    params,
    accountId,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    DeleteBarbershopController.Params
  >): Promise<Controller.Response<DeleteBarbershopController.Response>> {
    await this.deleteBarbershopUseCase.execute({
      barbershopId: params.barbershopId,
      accountId,
    });

    return {
      statusCode: 200,
    };
  }
}

export namespace DeleteBarbershopController {
  export type Response = void;
  export type Params = {
    barbershopId: string;
  };
}
