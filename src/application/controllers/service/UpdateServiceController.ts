import { Controller } from "@/application/contracts/Controller";
import { Service } from "@/application/entites/Service";
import { UpdateServiceUseCase } from "@/application/useCases/Service/UpdateServiceUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";

import {
  UpdateServiceBody,
  updateServiceSchema,
} from "./schema/updateServiceSchema";

@Injectable()
@Roles("admin")
@Schema(updateServiceSchema)
export class UpdateServiceController extends Controller<
  "private",
  UpdateServiceController.Response
> {
  constructor(private readonly updateServiceUseCase: UpdateServiceUseCase) {
    super();
  }

  protected override async handle({
    body,
    params,
    accountId,
  }: Controller.Request<
    "private",
    UpdateServiceBody,
    UpdateServiceController.Params
  >): Promise<Controller.Response<UpdateServiceController.Response>> {
    const { name, duration, price, file, isActive } = body;

    const { service, fileKey, uploadSignature } =
      await this.updateServiceUseCase.execute({
        accountId,
        barberId: params.barberId,
        serviceId: params.serviceId,
        name,
        duration,
        price,
        isActive,
        file,
      });

    return {
      statusCode: 201,
      body: {
        service,
        fileKey,
        uploadSignature,
      },
    };
  }
}

export namespace UpdateServiceController {
  export type Response = {
    service: Service;
    fileKey?: string;
    uploadSignature?: string;
  };

  export type Params = {
    barberId: string;
    serviceId: string;
  };
}
