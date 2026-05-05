import { Controller } from "@/application/contracts/Controller";
import { DeleteBarberUseCase } from "@/application/useCases/Barber/DeleteBarberUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";

@Injectable()
@Roles("admin")
export class DeleteBarberController extends Controller<
  "private",
  DeleteBarberController.Response
> {
  constructor(private readonly deleteBarberUseCase: DeleteBarberUseCase) {
    super();
  }
  protected override async handle({
    params,
    accountId,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    DeleteBarberController.Params
  >): Promise<Controller.Response<DeleteBarberController.Response>> {
    await this.deleteBarberUseCase.execute({
      barbershopId: params.barbershopId,
      barberId: params.barberId,
      accountId,
    });

    return {
      statusCode: 200,
    };
  }
}

export namespace DeleteBarberController {
  export type Response = void;

  export type Params = {
    barbershopId: string;
    barberId: string;
  };
}
