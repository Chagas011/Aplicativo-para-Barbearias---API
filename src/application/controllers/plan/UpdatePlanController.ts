import { Controller } from "@/application/contracts/Controller";

import { Plan } from "@/application/entites/Plan";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";

import { UpdatePlanUseCase } from "@/application/useCases/Plan/UpdatePlanUseCase";
import { UpdatePlanBody, updatePlanSchema } from "./schema/updatePlanSchema";

@Injectable()
@Roles("admin")
@Schema(updatePlanSchema)
export class UpdatePlanController extends Controller<
  "private",
  UpdatePlanController.Response
> {
  constructor(private readonly updatePlanUseCase: UpdatePlanUseCase) {
    super();
  }
  protected override async handle({
    body,
    params,
  }: Controller.Request<
    "private",
    UpdatePlanBody,
    UpdatePlanController.Params
  >): Promise<Controller.Response<UpdatePlanController.Response>> {
    const { name, price, remaningServices, services } = body;
    const { plan } = await this.updatePlanUseCase.execute({
      planId: params.planId,
      barbershopId: params.barbershopId,
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

export namespace UpdatePlanController {
  export type Response = {
    plan: Plan;
  };

  export type Params = {
    barbershopId: string;
    planId: string;
  };
}
