import { Controller } from "@/application/contracts/Controller";
import { Scheduling } from "@/application/entites/Scheduling";
import { ListSchedulingByBarberUseCase } from "@/application/useCases/scheduling/ListSchedulingByBarberUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";

@Injectable()
@Roles("admin")
export class ListSchedulingByBarberController extends Controller<
  "private",
  ListSchedulingByBarberController.Response
> {
  constructor(
    private readonly listSchedulingByBarberUseCase: ListSchedulingByBarberUseCase,
  ) {
    super();
  }
  protected override async handle({
    params,
    queryParams,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    ListSchedulingByBarberController.Params,
    ListSchedulingByBarberController.Query
  >): Promise<Controller.Response<ListSchedulingByBarberController.Response>> {
    const { scheduling } = await this.listSchedulingByBarberUseCase.execute({
      barberId: params.barberId,
      date: queryParams.date,
    });

    return {
      statusCode: 200,
      body: {
        scheduling,
      },
    };
  }
}

export namespace ListSchedulingByBarberController {
  export type Params = {
    barberId: string;
  };
  export type Query = {
    date?: string;
  };
  export type Response = {
    scheduling: Scheduling[];
  };
}
