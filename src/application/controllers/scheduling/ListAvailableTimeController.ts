import { Controller } from "@/application/contracts/Controller";
import { ListAvailableTimesUseCase } from "@/application/useCases/scheduling/ListAvailableTimesUseCase ";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListAvailableTimesController extends Controller<
  "public",
  ListAvailableTimesController.Response
> {
  constructor(
    private readonly listAvailableTimesUseCase: ListAvailableTimesUseCase,
  ) {
    super();
  }

  protected override async handle({
    params,
    queryParams,
  }: Controller.Request<
    "public",
    Record<string, unknown>,
    ListAvailableTimesController.Params,
    ListAvailableTimesController.Query
  >): Promise<Controller.Response<ListAvailableTimesController.Response>> {
    const { availableTimes } = await this.listAvailableTimesUseCase.execute({
      barbershopId: params.barbershopId,
      barberId: params.barberId,
      serviceId: queryParams.serviceId,
      date: queryParams.date,
    });

    return {
      statusCode: 200,
      body: {
        availableTimes,
      },
    };
  }
}

export namespace ListAvailableTimesController {
  export type Params = {
    barbershopId: string;
    barberId: string;
  };

  export type Query = {
    serviceId: string;
    date: string;
  };

  export type Response = {
    availableTimes: string[];
  };
}
