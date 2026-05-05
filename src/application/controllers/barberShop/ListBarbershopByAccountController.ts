import { Controller } from "@/application/contracts/Controller";
import { Barbershop } from "@/application/entites/BarberShop";
import { ListBarberShopByAccountUseCase } from "@/application/useCases/Barbershop/ListBarberShopByAccountUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListBarbershopByAccountController extends Controller<
  "private",
  ListBarbershopByAccountController.Response
> {
  constructor(
    private readonly listBarbershopByAccountUseCase: ListBarberShopByAccountUseCase,
  ) {
    super();
  }
  protected override async handle({
    accountId,
  }: Controller.Request<"private">): Promise<
    Controller.Response<ListBarbershopByAccountController.Response>
  > {
    const { barberShop } = await this.listBarbershopByAccountUseCase.execute({
      accountId,
    });
    return {
      statusCode: 200,
      body: {
        barberShop,
      },
    };
  }
}

export namespace ListBarbershopByAccountController {
  export type Response = {
    barberShop: Barbershop[];
  };
}
