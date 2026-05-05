import { Controller } from "@/application/contracts/Controller";
import { Service } from "@/application/entites/Service";
import { GetServiceByIdUseCase } from "@/application/useCases/Service/GetServiceByIdUseCase";

import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetServiceByIdController extends Controller<
  "private",
  GetServiceByIdController.Response
> {
  constructor(private readonly getServiceByIdUseCase: GetServiceByIdUseCase) {
    super();
  }
  protected override async handle({
    params,
  }: Controller.Request<
    "private",
    Record<string, unknown>,
    GetServiceByIdController.Params
  >): Promise<Controller.Response<GetServiceByIdController.Response>> {
    const { service } = await this.getServiceByIdUseCase.execute({
      barberId: params.barberId,
      serviceId: params.serviceId,
    });

    return {
      statusCode: 200,
      body: {
        service,
      },
    };
  }
}

export namespace GetServiceByIdController {
  export type Response = {
    service: Service;
  };

  export type Params = {
    serviceId: string;
    barberId: string;
  };
}
