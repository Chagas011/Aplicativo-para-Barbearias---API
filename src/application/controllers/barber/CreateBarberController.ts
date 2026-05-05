import { Controller } from "@/application/contracts/Controller";

import { Injectable } from "@/kernel/decorators/Injectable";
import { Schema } from "@/kernel/decorators/Schema";

import { Barber } from "@/application/entites/Barber";
import { CreateBarberUseCase } from "@/application/useCases/Barber/CreateBarberUseCase";
import { Roles } from "@/kernel/decorators/Role";
import {
  CreateBarberBody,
  createBarberSchema,
} from "./schema/createBarberSchema";

@Injectable()
@Roles("admin")
@Schema(createBarberSchema)
export class CreateBarberController extends Controller<
  "private",
  CreateBarberController.Response
> {
  constructor(private readonly createBarberUseCase: CreateBarberUseCase) {
    super();
  }
  protected override async handle({
    body,
    accountId,
  }: Controller.Request<"private", CreateBarberBody>): Promise<
    Controller.Response<CreateBarberController.Response>
  > {
    const { name, barbershopId, workingHours, file } = body;

    const { barber, fileKey, uploadSignature } =
      await this.createBarberUseCase.execute({
        accountId,
        name,
        barbershopId,
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

export namespace CreateBarberController {
  export type Response = {
    barber: Barber;
    fileKey?: string;
    uploadSignature?: string;
  };
}
