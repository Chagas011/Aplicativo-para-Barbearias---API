import { Controller } from "@/application/contracts/Controller";
import { Service } from "@/application/entites/Service";
import { ListServiceByBarberUseCase } from "@/application/useCases/Service/ListServiceByBarberUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListServiceByBarberController extends Controller<
  "private",
  ListServiceByBarberController.Response
> {
  constructor(
    private readonly listServiceByBarberUseCase: ListServiceByBarberUseCase,
  ) {
    super();
  }
  protected override async handle({
    params,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    ListServiceByBarberController.Params
  >): Promise<Controller.Response<ListServiceByBarberController.Response>> {
    const { service } = await this.listServiceByBarberUseCase.execute({
      barberId: params.barberId,
    });

    return {
      statusCode: 200,
      body: {
        service,
      },
    };
  }
}

export namespace ListServiceByBarberController {
  export type Response = {
    service: Service[];
  };

  export type Params = {
    barberId: string;
  };
}
