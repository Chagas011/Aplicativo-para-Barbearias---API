import { Controller } from "@/application/contracts/Controller";
import { Barbershop } from "@/application/entites/BarberShop";

import { CreateBarberShopUseCase } from "@/application/useCases/Barbershop/CreateBarbershopUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";
import {
  CreateBarbershopBody,
  createBarbershopSchema,
} from "./schema/createBarberShopSchema";

@Injectable()
@Roles("admin")
@Schema(createBarbershopSchema)
export class CreateBarbershopController extends Controller<
  "private",
  CreateBarbershopController.Response
> {
  constructor(
    private readonly createBarbershopUseCase: CreateBarberShopUseCase,
  ) {
    super();
  }
  protected override async handle({
    body,
    accountId,
  }: Controller.Request<"private", CreateBarbershopBody>): Promise<
    Controller.Response<CreateBarbershopController.Response>
  > {
    const { name, address, openingHours, phone, file, socialMedia } = body;
    const { barberShop, fileKey, uploadSignature } =
      await this.createBarbershopUseCase.execute({
        accountId,
        name,
        address,
        openingHours,
        phone,
        file,
        socialMedia,
      });
    return {
      statusCode: 201,
      body: {
        barberShop,
        fileKey,
        uploadSignature,
      },
    };
  }
}

export namespace CreateBarbershopController {
  export type Response = {
    barberShop: Barbershop;
    fileKey?: string;
    uploadSignature?: string;
  };
}
