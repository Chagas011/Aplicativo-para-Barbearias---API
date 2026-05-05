import { Controller } from "@/application/contracts/Controller";
import { Barber } from "@/application/entites/Barber";
import { GetBarberByIdUseCase } from "@/application/useCases/Barber/GetBarberByIdUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetBarberByIdController extends Controller<
  "private",
  GetBarberByIdController.Response
> {
  constructor(private readonly getBarberByIdUseCase: GetBarberByIdUseCase) {
    super();
  }
  protected override async handle({
    params,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    GetBarberByIdController.Params
  >): Promise<Controller.Response<GetBarberByIdController.Response>> {
    const { barber } = await this.getBarberByIdUseCase.execute({
      barberId: params.barberId,
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

export namespace GetBarberByIdController {
  export type Response = {
    barber: Barber;
  };

  export type Params = {
    barbershopId: string;
    barberId: string;
  };
}
