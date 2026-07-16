import { Controller } from "@/application/contracts/Controller";

import { CreateSchedulingUseCase } from "@/application/useCases/scheduling/CreateSchedulingUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Schema } from "@/kernel/decorators/Schema";
import {
  CreateSchedulingBody,
  createSchedulingSchema,
} from "./schema/createSchedulingSchema";

@Injectable()
@Schema(createSchedulingSchema)
export class CreateSchedulingController extends Controller<
  "private",
  CreateSchedulingController.Response
> {
  constructor(
    private readonly createSchedulingUseCase: CreateSchedulingUseCase,
  ) {
    super();
  }
  protected override async handle({
    body,
    params,
    accountId,
  }: Controller.Request<
    "private",
    CreateSchedulingBody,
    CreateSchedulingController.Params
  >): Promise<Controller.Response<CreateSchedulingController.Response>> {
    const { date, serviceId, startTime } = body;
    const { schedulingId } = await this.createSchedulingUseCase.execute({
      barberId: params.barberId,
      barbershopId: params.barbershopId,
      date,
      serviceId,
      startTime,
      accountId,
    });
    return {
      statusCode: 201,
      body: {
        schedulingId,
      },
    };
  }
}

export namespace CreateSchedulingController {
  export type Response = {
    schedulingId: string;
  };

  export type Params = {
    barbershopId: string;
    barberId: string;
  };
}
