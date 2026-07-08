import { Controller } from "@/application/contracts/Controller";
import { Barbershop } from "@/application/entites/BarberShop";
import { ListBarberShopUseCase } from "@/application/useCases/Barbershop/ListBarberShopUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListBarbershopController extends Controller<
  "public",
  ListBarbershopController.Response
> {
  constructor(private readonly listBarbershopUseCase: ListBarberShopUseCase) {
    super();
  }
  protected override async handle(): Promise<
    Controller.Response<ListBarbershopController.Response>
  > {
    const { barberShop } = await this.listBarbershopUseCase.execute();
    return {
      statusCode: 200,
      body: {
        barberShop,
      },
    };
  }
}

export namespace ListBarbershopController {
  export type Response = {
    barberShop: Barbershop[];
  };
}
