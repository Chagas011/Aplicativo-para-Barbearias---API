import { Controller } from "@/application/contracts/Controller";
import { DeletePlanUseCase } from "@/application/useCases/Plan/DeletePlanUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class DeletePlanController extends Controller<
  "private",
  DeletePlanController.Response
> {
  constructor(private readonly DeletePlanUseCase: DeletePlanUseCase) {
    super();
  }
  protected override async handle({
    params,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    DeletePlanController.Params
  >): Promise<Controller.Response<DeletePlanController.Response>> {
    await this.DeletePlanUseCase.execute({
      barbershopId: params.barbershopId,
      planId: params.planId,
    });
    return {
      statusCode: 201,
    };
  }
}

export namespace DeletePlanController {
  export type Response = void;

  export type Params = {
    barbershopId: string;
    planId: string;
  };
}
