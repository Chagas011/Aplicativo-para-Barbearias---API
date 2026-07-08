import { Controller } from "@/application/contracts/Controller";

import { Plan } from "@/application/entites/Plan";
import { CreatePlanUseCase } from "@/application/useCases/Plan/CreatePlanUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";
import { CreatePlanBody, createPlanSchema } from "./schema/createPlanSchema";

@Injectable()
@Roles("admin")
@Schema(createPlanSchema)
export class CreatePlanController extends Controller<
  "private",
  CreatePlanController.Response
> {
  constructor(private readonly createPlanUseCase: CreatePlanUseCase) {
    super();
  }
  protected override async handle({
    body,
    accountId,
    params,
  }: Controller.Request<
    "private",
    CreatePlanBody,
    CreatePlanController.Params
  >): Promise<Controller.Response<CreatePlanController.Response>> {
    const { name, price, remaningServices, services } = body;
    const { plan } = await this.createPlanUseCase.execute({
      barbershopId: params.barbershopId,
      accountId,
      name,
      price,
      remaningServices,
      services,
    });
    return {
      statusCode: 201,
      body: {
        plan,
      },
    };
  }
}

export namespace CreatePlanController {
  export type Response = {
    plan: Plan;
  };

  export type Params = {
    barbershopId: string;
  };
}
