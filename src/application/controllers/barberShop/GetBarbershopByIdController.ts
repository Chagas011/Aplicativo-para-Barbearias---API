import { Controller } from "@/application/contracts/Controller";
import { Barbershop } from "@/application/entites/BarberShop";
import { GetBarbershopByIdUseCase } from "@/application/useCases/Barbershop/GetBarbershopByIdUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetBarbershopByIdController extends Controller<
  "private",
  GetBarbershopByIdController.Response
> {
  constructor(
    private readonly getBarbershopByIdUseCase: GetBarbershopByIdUseCase,
  ) {
    super();
  }
  protected override async handle({
    params,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    GetBarbershopByIdController.Params
  >): Promise<Controller.Response<GetBarbershopByIdController.Response>> {
    const { barbershop } = await this.getBarbershopByIdUseCase.execute({
      barbershopId: params.barbershopId,
    });

    return {
      statusCode: 200,
      body: {
        barbershop,
      },
    };
  }
}

export namespace GetBarbershopByIdController {
  export type Response = {
    barbershop: Barbershop;
  };

  export type Params = {
    barbershopId: string;
  };
}
