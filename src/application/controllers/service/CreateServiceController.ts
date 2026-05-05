import { Controller } from "@/application/contracts/Controller";
import { Service } from "@/application/entites/Service";
import { CreateServiceUseCase } from "@/application/useCases/Service/CreateServiceUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";
import {
  CreateServiceBody,
  createServiceSchema,
} from "./schema/createServiceSchema";

@Injectable()
@Roles("admin")
@Schema(createServiceSchema)
export class CreateServiceController extends Controller<
  "private",
  CreateServiceController.Response
> {
  constructor(private readonly createServiceUseCase: CreateServiceUseCase) {
    super();
  }

  protected override async handle({
    body,
    accountId,
  }: Controller.Request<"private", CreateServiceBody>): Promise<
    Controller.Response<CreateServiceController.Response>
  > {
    const { name, duration, price, file, barberId, isActive } = body;

    const { service, fileKey, uploadSignature } =
      await this.createServiceUseCase.execute({
        accountId,
        barberId,
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

export namespace CreateServiceController {
  export type Response = {
    service: Service;
    fileKey?: string;
    uploadSignature?: string;
  };
}
