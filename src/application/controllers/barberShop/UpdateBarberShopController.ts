import { Controller } from "@/application/contracts/Controller";
import { Barbershop } from "@/application/entites/BarberShop";

import { UpdateBarbershopUseCase } from "@/application/useCases/Barbershop/UpdateBarbershopUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { Roles } from "@/kernel/decorators/Role";
import { Schema } from "@/kernel/decorators/Schema";
import {
  UpdateBarbershopBody,
  updateBarbershopSchema,
} from "./schema/updateBarberShopSchema";

@Injectable()
@Roles("admin")
@Schema(updateBarbershopSchema)
export class UpdateBarberShopController extends Controller<
  "private",
  UpdateBarberShopController.Response
> {
  constructor(
    private readonly updateBarbershopUseCase: UpdateBarbershopUseCase,
  ) {
    super();
  }
  protected override async handle({
    body,
    params,
    accountId,
  }: Controller.Request<
    "private",
    UpdateBarbershopBody,
    UpdateBarberShopController.Params
  >): Promise<Controller.Response<UpdateBarberShopController.Response>> {
    const { name, address, openingHours, phone, file, socialMedia } = body;
    const { barbershop, fileKey, uploadSignature } =
      await this.updateBarbershopUseCase.execute({
        accountId,
        barbershopId: params.barbershopId,
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
        barbershop,
        fileKey,
        uploadSignature,
      },
    };
  }
}

export namespace UpdateBarberShopController {
  export type Response = {
    barbershop: Barbershop;
    fileKey?: string;
    uploadSignature?: string;
  };

  export type Params = {
    barbershopId: string;
  };
}
