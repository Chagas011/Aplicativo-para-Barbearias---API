import { Controller } from "@/application/contracts/Controller";
import { DeleteSchedulingUseCase } from "@/application/useCases/scheduling/DeleteSchedulingUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class DeleteSchedulingController extends Controller<
  "private",
  DeleteSchedulingController.Response
> {
  constructor(
    private readonly deleteSchedulingUseCase: DeleteSchedulingUseCase,
  ) {
    super();
  }

  protected override async handle({
    params,
    accountId,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    DeleteSchedulingController.Params
  >): Promise<Controller.Response<DeleteSchedulingController.Response>> {
    await this.deleteSchedulingUseCase.execute({
      accountId,
      barberId: params.barberId,
      date: params.date,
      startTime: params.startTime,
    });

    return {
      statusCode: 204,
    };
  }
}

export namespace DeleteSchedulingController {
  export type Params = {
    barberId: string;
    date: string;
    startTime: string;
  };

  export type Response = void;
}
