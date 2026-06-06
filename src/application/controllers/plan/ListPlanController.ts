import { Controller } from "@/application/contracts/Controller";

import { Plan } from "@/application/entites/Plan";
import { ListPlanByBarbershopUseCase } from "@/application/useCases/Plan/ListPlanByBarbershopUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListPlanController extends Controller<
  "private",
  ListPlanController.Response
> {
  constructor(
    private readonly listPlanByBarbershopUseCase: ListPlanByBarbershopUseCase,
  ) {
    super();
  }
  protected override async handle({
    params,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    ListPlanController.Params
  >): Promise<Controller.Response<ListPlanController.Response>> {
    const { plans } = await this.listPlanByBarbershopUseCase.execute({
      barbershopId: params.barbershopId,
    });
    return {
      statusCode: 201,
      body: {
        plans,
      },
    };
  }
}

export namespace ListPlanController {
  export type Response = {
    plans: Plan[];
  };

  export type Params = {
    barbershopId: string;
  };
}
