import { Controller } from "@/application/contracts/Controller";
import { Barber } from "@/application/entites/Barber";
import { ListByBarbershopUseCase } from "@/application/useCases/Barber/ListByBarbershopUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListByBarbershopController extends Controller<
  "private",
  ListByBarbershopController.Response
> {
  constructor(private readonly listByBarbershop: ListByBarbershopUseCase) {
    super();
  }
  protected override async handle({
    params,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    ListByBarbershopController.Params
  >): Promise<Controller.Response<ListByBarbershopController.Response>> {
    const { barber } = await this.listByBarbershop.execute({
      barbershopId: params.barbershopId,
    });

    return {
      statusCode: 200,
      body: {
        barber,
      },
    };
  }
}

export namespace ListByBarbershopController {
  export type Response = {
    barber: Barber[];
  };

  export type Params = {
    barbershopId: string;
  };
}
