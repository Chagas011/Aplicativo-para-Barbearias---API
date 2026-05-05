import { Controller } from "@/application/contracts/Controller";

import { Injectable } from "@/kernel/decorators/Injectable";
import { Schema } from "@/kernel/decorators/Schema";

import { Barber } from "@/application/entites/Barber";
import { UpdateBarberUseCase } from "@/application/useCases/Barber/UpdateBarberUseCase";
import { Roles } from "@/kernel/decorators/Role";
import {
  UpdateBarberBody,
  updateBarberSchema,
} from "./schema/updateBarberSchema";

@Injectable()
@Roles("admin")
@Schema(updateBarberSchema)
export class UpdateBarberController extends Controller<
  "private",
  UpdateBarberController.Response
> {
  constructor(private readonly updateBarberUseCase: UpdateBarberUseCase) {
    super();
  }
  protected override async handle({
    body,
    params,
    accountId,
  }: Controller.Request<
    "private",
    UpdateBarberBody,
    UpdateBarberController.Params
  >): Promise<Controller.Response<UpdateBarberController.Response>> {
    const { name, workingHours, file } = body;

    const { barber, fileKey, uploadSignature } =
      await this.updateBarberUseCase.execute({
        accountId,
        barberId: params.barberId,
        barbershopId: params.barbershopId,
        name,
        workingHours,
        file,
      });
    return {
      statusCode: 201,
      body: {
        barber,
        fileKey,
        uploadSignature,
      },
    };
  }
}

export namespace UpdateBarberController {
  export type Response = {
    barber: Barber;
    fileKey?: string;
    uploadSignature?: string;
  };

  export type Params = {
    barbershopId: string;
    barberId: string;
  };
}
